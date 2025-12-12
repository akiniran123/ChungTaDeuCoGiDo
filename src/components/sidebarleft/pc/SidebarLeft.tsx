"use client";

import { useState, useEffect, useCallback } from "react";
import SidebarMainNav from "./SidebarMainNav";
import SidebarCommunity from "./SidebarCommunity";
import MessagesPanel from "./MessagesPanel";
import MiniChatBox from "@/app/MiniChat/MiniChatBox";
import NewsPanel from "./NewsPanel";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/Navbar/pc/LogoSearchIcon/logo";

// -------------------------
// TYPES
// -------------------------
type Conversation = {
  partner_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_time: string;
  is_read?: boolean;
};

type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string | null;
  type?: string | null;
};

type UserRow = {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
};

// -------------------------
export default function SidebarLeft() {
  const [openMessages, setOpenMessages] = useState(false);
  const [openNews, setOpenNews] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Mở nhiều chat cùng lúc
  const [openChats, setOpenChats] = useState<string[]>([]);

  // -------------------------
  // INIT USER
  // -------------------------
  useEffect(() => {
    setIsClient(true);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id);
    });
  }, []);

  // -------------------------
  // loadUnreadCount (useCallback so it can be a dependency)
  // -------------------------
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("messages")
      .select("id")
      .eq("receiver_id", userId)
      .eq("is_read", false);

    setUnreadCount(data?.length || 0);
  }, [userId]);

  // -------------------------
  // loadConversations (useCallback so it can be a dependency)
  // -------------------------
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
      const sender = msg.sender_id as string;
      const receiver = msg.receiver_id as string;
      const partner = sender === userId ? receiver : sender;
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
      const u = (usersList as UserRow[] | null | undefined)?.find((x) => x.id === pid);
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

  // -------------------------
  // LOAD INITIAL DATA (include callbacks in deps)
  // -------------------------
  useEffect(() => {
    if (!userId) return;
    loadConversations();
    loadUnreadCount();
  }, [userId, loadConversations, loadUnreadCount]);

  // -------------------------
  // Realtime listener
  // -------------------------
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageRow;
          setUnreadCount((prev) => prev + 1);

          setConversations((prev) => {
            const partnerId = newMsg.sender_id;
            const index = prev.findIndex((c) => c.partner_id === partnerId);

            if (index >= 0) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                last_message: newMsg.content,
                last_time: newMsg.created_at || new Date().toISOString(),
                is_read: false,
              };
              return updated;
            } else {
              return [
                ...prev,
                {
                  partner_id: partnerId,
                  username: "Unknown",
                  avatar_url: "/default-avatar.png",
                  last_message: newMsg.content,
                  last_time: newMsg.created_at || new Date().toISOString(),
                  is_read: false,
                },
              ];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // -------------------------
  // CLEAR UNREAD (single or all)
  // -------------------------
  const clearUnread = async (partnerId?: string) => {
    if (!userId) return;

    if (partnerId) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", userId)
        .eq("is_read", false);

      setConversations((prev) => prev.map((c) => (c.partner_id === partnerId ? { ...c, is_read: true } : c)));
    } else {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("receiver_id", userId)
        .eq("is_read", false);

      setConversations((prev) => prev.map((c) => ({ ...c, is_read: true })));
    }

    loadUnreadCount();
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-sm flex flex-col overflow-y-auto z-40">
        <div className="mt-6 mb-2 px-4">
          <Logo />
        </div>

        <SidebarMainNav
          setOpenMessages={setOpenMessages}
          setOpenNews={setOpenNews}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          unreadCount={unreadCount}
        />

        <SidebarCommunity />
      </aside>

      {isClient && (
        <MessagesPanel
          open={openMessages}
          setOpen={setOpenMessages}
          conversations={conversations}
          onSelect={(id) => {
            setOpenChats((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          clearUnread={clearUnread}
        />
      )}

      {isClient && (
        <NewsPanel open={openNews} setOpen={setOpenNews} activePanel={activePanel} setActivePanel={setActivePanel} />
      )}

      {/* Render tất cả MiniChatBox đang mở */}
      {openChats.map((partnerId) => (
        <MiniChatBox
          key={partnerId}
          partnerId={partnerId}
          onClose={() => setOpenChats((prev) => prev.filter((id) => id !== partnerId))}
          onReadMessages={() => clearUnread(partnerId)}
          onNewConversation={() => {
            setConversations((prev) => {
              const exists = prev.find((c) => c.partner_id === partnerId);
              if (exists) return prev;

              return [
                ...prev,
                {
                  partner_id: partnerId,
                  username: "Unknown",
                  avatar_url: "/default-avatar.png",
                  last_message: "",
                  last_time: new Date().toISOString(),
                  is_read: true,
                },
              ];
            });
          }}
        />
      ))}
    </>
  );
}