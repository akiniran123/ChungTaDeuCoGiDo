"use client";

import React, { useState, useEffect } from "react";
import SidebarMainNav from "./SidebarMainNav";
import SidebarCommunity from "./SidebarCommunity";
import MessagesPanel, { Conversation } from "./MessagesPanel";
import MiniChatBox from "@/app/MiniChat/MiniChatBox";
import { supabase } from "@/lib/supabase/client";

export default function SidebarLeft() {
  const [openMessages, setOpenMessages] = useState(false);
  const [openMiniChat, setOpenMiniChat] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (userId) loadConversations();
  }, [userId]);

  async function loadConversations() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) return;

    const map = new Map<
      string,
      { last_message: string; last_time: string }
    >();

    data.forEach((msg) => {
      const partner =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      if (!map.has(partner)) {
        map.set(partner, {
          last_message: msg.content,
          last_time: msg.created_at ?? "", // luôn string
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
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 shadow-sm z-40">
        <SidebarMainNav setOpenMessages={setOpenMessages} />
        <SidebarCommunity />
      </aside>

      {/* PANEL */}
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

      {/* MINI CHAT */}
      {openMiniChat && selectedPartner && (
        <MiniChatBox
          partnerId={selectedPartner}
          onClose={() => setOpenMiniChat(false)}
        />
      )}
    </>
  );
}
