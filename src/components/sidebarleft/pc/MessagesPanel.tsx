// MessagesPanel.tsx
"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useChat } from "@/components/MiniChat/ChatContext";

export type Conversation = {
  partner_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_time: string;
  is_read?: boolean;
};

type MessagesPanelProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: Conversation[];
  onSelect: (partnerId: string) => void;
  activePanel: string | null;
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>;
  clearUnread: (partnerId?: string) => void;
};

const ConversationItem = React.memo(function ConversationItem({
  c,
  onClick,
}: {
  c: Conversation & { formatted_time: string };
  onClick: (partnerId: string) => void;
}) {
  return (
    <div
      key={c.partner_id}
      className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(c.partner_id)}
    >
      <div className="w-10 h-10 relative">
        <Image
          src={c.avatar_url || "/default-avatar.png"}
          alt={c.username}
          fill
          className="rounded-full object-cover"
          sizes="40px"
        />
      </div>
      <div className="flex-1">
        <p className={c.is_read === false ? "text-black font-medium" : "text-gray-500"}>
          {c.username}
        </p>
        <p
          className={`text-sm line-clamp-2 ${
            c.is_read === false ? "text-black font-medium" : "text-gray-500"
          }`}
        >
          {c.last_message}
        </p>
      </div>
      <span className="text-[11px] text-gray-400 whitespace-nowrap">{c.formatted_time}</span>
    </div>
  );
});

export default function MessagesPanel({
  open,
  setOpen,
  conversations,
  onSelect,
  activePanel,
  setActivePanel,
  clearUnread,
}: MessagesPanelProps) {
  const { openChat } = useChat();

  const formattedConversations = useMemo(
    () =>
      conversations.map((c) => ({
        ...c,
        formatted_time: new Date(c.last_time).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [conversations]
  );

  if (typeof document === "undefined") return null;

  const baseClasses = [
    "fixed",
    "top-[6.5rem]",
    "left-64",
    "w-80",
    "h-[calc(100vh-6.5rem)]",
    "bg-white",
    "border-r",
    "border-gray-200",
    "shadow-lg",
    "transition-all",
    "duration-300",
  ];

  const openClasses = open ? ["opacity-100", "translate-x-0"] : ["opacity-0", "-translate-x-10", "pointer-events-none"];

  const zClass = activePanel === "messages" ? "z-[999999]" : "z-[90000]";

  const panelClass = [...baseClasses, ...openClasses, zClass].join(" ");

  const handleConversationClick = (id: string) => {
    // open global chat (single source of truth)
    openChat(id);
    // clear unread locally / server
    clearUnread(id);
    // notify parent if needed
    onSelect(id);
    // close messages panel to avoid duplicate UI
    setOpen(false);
    setActivePanel(null);
  };

  const panelJSX = (
    <div className={panelClass} onMouseDown={() => setActivePanel("messages")}>
      <div className="p-4 font-semibold flex justify-between">
        <span>Tin nhắn</span>
        <button
          onClick={() => {
            setOpen(false);
            setActivePanel(null);
          }}
          className="cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto h-full">
        {formattedConversations.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">Bạn chưa có cuộc trò chuyện nào.</p>
        ) : (
          formattedConversations.map((c) => (
            <ConversationItem key={c.partner_id} c={c} onClick={handleConversationClick} />
          ))
        )}
      </div>
    </div>
  );

  return createPortal(panelJSX, document.body);
}