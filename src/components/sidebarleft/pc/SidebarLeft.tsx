"use client";

import { useState, useEffect } from "react";
import SidebarMainNav from "./SidebarMainNav";
import SidebarCommunity from "./SidebarCommunity";
import MessagesPanel from "./MessagesPanel";
import MiniChatBox from "@/app/MiniChat/MiniChatBox";
import NewsPanel from "./NewsPanel";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/Navbar/pc/LogoSearchIcon/logo";

// -------------------------
// TYPE
// -------------------------
type Conversation = {
  partner_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_time: string;
  is_read?: boolean; // ⭐ Thêm để đánh dấu chưa đọc
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

export default function SidebarLeft() {
  const [openMessages, setOpenMessages] = useState(false);
  const [openMiniChat, setOpenMiniChat] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [openNews, setOpenNews] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

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
  // LOAD INITIAL DATA
  // -------------------------
  useEffect(() => {
    if (!userId) return;
    loadConversations();
    loadUnreadCount();
  }, [userId]);

  // -------------------------
  // REALTIME LISTENER (CẬP NHẬT NGAY UNREAD + CONVERSATION)
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
          const newMsg = payload.new;

          // ✅ Cập nhật số lượng chưa đọc ngay
          setUnreadCount((prev) => prev + 1);

          // ✅ Cập nhật conversation
          setConversations((prev) => {
            const partnerId = newMsg.sender_id;
            const index = prev.findIndex((c) => c.partner_id === partnerId);

            if (index >= 0) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                last_message: newMsg.content,
                last_time: newMsg.created_at || new Date().toISOString(),
                is_read: false, // ⭐ đánh dấu chưa đọc
              };
              return updated;
            } else {
              // Nếu chưa có conversation, thêm mới
              return [
                ...prev,
                {
                  partner_id: partnerId,
                  username: "Unknown", // hoặc lấy từ cache user nếu có
                  avatar_url: "/default-avatar.png",
                  last_message: newMsg.content,
                  last_time: newMsg.created_at || new Date().toISOString(),
                  is_read: false, // ⭐ đánh dấu chưa đọc
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
  // COUNT UNREAD
  // -------------------------
  async function loadUnreadCount() {
    if (!userId) return;

    const { data } = await supabase
      .from("messages")
      .select("id")
      .eq("receiver_id", userId)
      .eq("is_read", false);

    setUnreadCount(data?.length || 0);
  }

  // -------------------------
  // CLEAR ALL UNREAD (MESSAGES PANEL)
  // -------------------------
  const clearAllUnread = async () => {
    if (!userId) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", userId)
      .eq("is_read", false);

    setUnreadCount(0); // cập nhật ngay
    setConversations((prev) =>
      prev.map((c) => ({ ...c, is_read: true }))
    ); // ⭐ tất cả conversation đánh dấu đã đọc
  };

  // -------------------------
  // CLEAR UNREAD FOR 1 PARTNER (MINI CHAT BOX)
  // -------------------------
  const clearUnreadFromPartner = async (partnerId: string) => {
    if (!userId || !partnerId) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", partnerId)
      .eq("receiver_id", userId)
      .eq("is_read", false);

    // Cập nhật ngay unreadCount
    loadUnreadCount();

    // ⭐ đánh dấu conversation đã đọc
    setConversations((prev) =>
      prev.map((c) =>
        c.partner_id === partnerId ? { ...c, is_read: true } : c
      )
    );
  };

  // -------------------------
  // LOAD LAST MESSAGE FOR EACH PARTNER
  // -------------------------
  async function loadConversations() {
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
          last_message: (msg.content as string) || "",
          last_time: (msg.created_at as string) || "",
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
      const u = usersList?.find((x: any) => x.id === pid);
      const info = map.get(pid)!;

      // ⭐ Kiểm tra xem còn tin nhắn chưa đọc
      const hasUnread = (data as MessageRow[]).some(
        (msg) =>
          msg.sender_id === pid &&
          msg.receiver_id === userId &&
          msg.is_read === false
      );

      return {
        partner_id: pid,
        username: u?.username || "Unknown",
        avatar_url: u?.avatar_url || "/default-avatar.png",
        last_message: info.last_message,
        last_time: info.last_time,
        is_read: !hasUnread, // true nếu tất cả đã đọc, false nếu còn chưa đọc
      };
    });

    setConversations(final);
  }

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

      {/* PANEL MESSAGES */}
      {isClient && (
        <MessagesPanel
          open={openMessages}
          setOpen={setOpenMessages}
          conversations={conversations}
          onSelect={(id) => {
            setSelectedPartner(id);
            setOpenMiniChat(true);
          }}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          clearUnread={clearAllUnread}
        />
      )}

      {/* PANEL NEWS */}
      {isClient && (
        <NewsPanel
          open={openNews}
          setOpen={setOpenNews}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      )}

      {/* MINI CHAT BOX */}
      {openMiniChat && selectedPartner && (
        <MiniChatBox
          partnerId={selectedPartner}
          onClose={() => setOpenMiniChat(false)}
          onReadMessages={() => clearUnreadFromPartner(selectedPartner)}
        />
      )}
    </>
  );
}
