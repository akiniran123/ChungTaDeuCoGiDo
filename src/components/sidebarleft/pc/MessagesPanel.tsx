// src/components/MiniChat/MessagesPanel.tsx
"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
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
  const hasAvatar =
    !!c.avatar_url && c.avatar_url.trim() !== "";

  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(c.partner_id)}
    >
      {/* AVATAR */}
      <div className="w-10 h-10 flex items-center justify-center">
        {hasAvatar ? (
          <Image
            src={c.avatar_url!}
            alt={c.username}
            width={40}
            height={40}
            className="rounded-full object-cover border border-gray-200 bg-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <UserIcon size={20} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={
            c.is_read === false
              ? "text-black font-medium truncate"
              : "text-gray-500 truncate"
          }
        >
          {c.username}
        </p>
        <p
          className={`text-sm line-clamp-2 ${
            c.is_read === false
              ? "text-black font-medium"
              : "text-gray-500"
          }`}
        >
          {c.last_message}
        </p>
      </div>

      <span className="text-[11px] text-gray-400 whitespace-nowrap">
        {c.formatted_time}
      </span>
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
  const { openChat, focusChat, isOpen } = useChat();

  const formattedConversations = useMemo(
    () =>
      conversations.map((c) => ({
        ...c,
        formatted_time: new Date(c.last_time).toLocaleTimeString(
          "vi-VN",
          { hour: "2-digit", minute: "2-digit" }
        ),
      })),
    [conversations]
  );

  if (typeof document === "undefined") return null;

  const panelClass = [
    "fixed top-[6.5rem] left-64 w-80 h-[calc(100vh-6.5rem)]",
    "bg-white border-r border-gray-200 shadow-lg transition-all duration-300",
    open
      ? "opacity-100 translate-x-0 z-[999999]"
      : "opacity-0 -translate-x-10 pointer-events-none z-[90000]",
  ].join(" ");

  const handleConversationClick = (id: string) => {
    if (isOpen(id)) {
      focusChat(id);
    } else {
      openChat(id);
    }
    clearUnread(id);
    onSelect(id);
    setOpen(false);
    setActivePanel(null);
  };

  return createPortal(
    <div className={panelClass}>
      <div className="p-4 font-semibold flex justify-between">
        <span>Tin nhắn</span>
        <button
          onClick={() => {
            setOpen(false);
            setActivePanel(null);
          }}
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto h-full">
        {formattedConversations.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">
            Bạn chưa có cuộc trò chuyện nào.
          </p>
        ) : (
          formattedConversations.map((c) => (
            <ConversationItem
              key={c.partner_id}
              c={c}
              onClick={handleConversationClick}
            />
          ))
        )}
      </div>
    </div>,
    document.body
  );
}
