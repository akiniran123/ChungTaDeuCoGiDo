import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Conversation, MessageRow, UserRow } from "@/components/sidebarleft/types/chat";

export function useSidebarData() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load User ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id);
    });
  }, []);

  // Load Unread Count
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("messages")
      .select("id")
      .eq("receiver_id", userId)
      .eq("is_read", false);
    setUnreadCount(data?.length || 0);
  }, [userId]);

  // Load Conversations
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error || !data) return;

    const map = new Map<string, { last_message: string; last_time: string }>();
    (data as Partial<MessageRow>[]).forEach((msg) => {
      if (!msg) return;
      const partner = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      if (!partner) return;
      if (!map.has(partner)) {
        map.set(partner, {
          last_message: msg.content || "",
          last_time: msg.created_at || "",
        });
      }
    });

    const partnerIds = [...map.keys()];
    if (partnerIds.length === 0) return setConversations([]);

    const { data: usersList } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .in("id", partnerIds);

    const final: Conversation[] = partnerIds.map((pid) => {
      const u = (usersList as UserRow[] | null)?.find((x) => x.id === pid);
      const info = map.get(pid)!;
      const hasUnread = (data as MessageRow[]).some(
        (msg) => msg.sender_id === pid && msg.receiver_id === userId && msg.is_read === false
      );
      return {
        partner_id: pid,
        username: u?.username || "Unknown",
        avatar_url: u?.avatar_url || "/default-avatar.png",
        last_message: info.last_message,
        last_time: info.last_time,
        is_read: !hasUnread,
      };
    });
    setConversations(final);
  }, [userId]);

  // Realtime & Init
  useEffect(() => {
    if (!userId) return;
    loadConversations();
    loadUnreadCount();

    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${userId}`,
      }, (payload) => {
        const newMsg = payload.new as MessageRow;
        setUnreadCount(prev => prev + 1);
        loadConversations(); // Hoặc update state thủ công như code cũ của bạn
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, loadConversations, loadUnreadCount]);

  // Clear Unread
  const clearUnread = async (partnerId?: string) => {
    if (!userId) return;
    const query = supabase.from("messages").update({ is_read: true }).eq("receiver_id", userId).eq("is_read", false);
    if (partnerId) query.eq("sender_id", partnerId);
    await query;
    loadUnreadCount();
    loadConversations();
  };

  return { conversations, unreadCount, clearUnread, userId };
}