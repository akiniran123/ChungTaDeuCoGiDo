"use client";

import { useState, useEffect } from "react";
import SidebarMainNav from "./SidebarMainNav";
import SidebarCommunity from "./SidebarCommunity";
import MessagesPanel from "./MessagesPanel";
import MiniChatBox from "@/app/MiniChat/MiniChatBox";
import NewsPanel from "./NewsPanel";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/Navbar/pc/LogoSearchIcon/logo";

type Conversation = {
  partner_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_time: string;
};

export default function SidebarLeft() {
  const [openMessages, setOpenMessages] = useState(false);
  const [openMiniChat, setOpenMiniChat] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [openNews, setOpenNews] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Lấy user hiện tại
  useEffect(() => {
    setIsClient(true);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id);
    });
  }, []);

  // Load conversations khi userId có
  useEffect(() => {
    if (!userId) return;
    loadConversations();
  }, [userId]);

  async function loadConversations() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error || !data) return;

    const map = new Map<string, { last_message: string; last_time: string }>();

    data.forEach((msg) => {
      const partner =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

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
      const u = usersList?.find((x) => x.id === pid);
      const info = map.get(pid)!;

      return {
        partner_id: pid,
        username: u?.username || "Unknown",
        avatar_url: u?.avatar_url || "/default-avatar.png",
        last_message: info.last_message,
        last_time: info.last_time,
      };
    });

    setConversations(final);
  }

  return (
    <>
      {/* Sidebar chính */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-gray-200 shadow-sm z-40 flex flex-col overflow-y-auto">
        <Logo />
        <SidebarMainNav
          setOpenMessages={setOpenMessages}
          setOpenNews={setOpenNews} // Nút thông báo sẽ mở panel
        />
        <SidebarCommunity />
      </aside>

      {/* Panel tin nhắn */}
      {isClient && (
        <MessagesPanel
          open={openMessages}
          setOpen={setOpenMessages}
          conversations={conversations}
          onSelect={(id) => {
            setSelectedPartner(id);
            setOpenMiniChat(true);
          }}
        />
      )}

      {/* Panel thông báo, chỉ hiện khi nhấn nút */}
      {isClient && (
        <NewsPanel
          open={openNews}
          setOpen={setOpenNews}
        />
      )}

      {/* Mini chat */}
      {openMiniChat && selectedPartner && (
        <MiniChatBox
          partnerId={selectedPartner}
          onClose={() => setOpenMiniChat(false)}
        />
      )}
    </>
  );
}
