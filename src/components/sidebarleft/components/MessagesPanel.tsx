"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { User as UserIcon, X } from "lucide-react";
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
  const hasAvatar = !!c.avatar_url && c.avatar_url.trim() !== "";

  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 md:border-none"
      onClick={() => onClick(c.partner_id)}
    >
      <div className="w-12 h-12 md:w-10 md:h-10 flex-shrink-0">
        {hasAvatar ? (
          <Image
            src={c.avatar_url!}
            alt={c.username}
            width={48}
            height={48}
            className="rounded-full object-cover border border-gray-100 bg-white w-full h-full"
          />
        ) : (
          <div className="w-full h-full rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400">
            <UserIcon size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <p className={`truncate text-base md:text-sm ${c.is_read === false ? "font-bold text-black" : "text-gray-700"}`}>
            {c.username}
          </p>
          <span className="text-[11px] text-gray-400 ml-2 uppercase">{c.formatted_time}</span>
        </div>
        <p className={`text-sm line-clamp-1 ${c.is_read === false ? "font-semibold text-gray-900" : "text-gray-500"}`}>
          {c.last_message}
        </p>
      </div>
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
        formatted_time: new Date(c.last_time).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [conversations]
  );

  if (typeof document === "undefined") return null;

  // LỚP PHỦ CSS ĐỂ FULL MOBILE VÀ CỐ ĐỊNH TRÊN PC
  const panelClass = `
    fixed inset-0 z-[99999] 
    md:inset-auto md:top-[6.5rem] md:left-64 md:w-80 md:h-[calc(100vh-6.5rem)] 
    bg-white border-r border-gray-200 shadow-2xl md:shadow-lg 
    transition-all duration-300 transform
    ${open 
      ? "translate-x-0 opacity-100" 
      : "-translate-x-full md:-translate-x-10 opacity-0 pointer-events-none"}
  `;

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
      {/* HEADER: Có padding-top cho mobile để tránh tai thỏ nếu cần */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 md:bg-white pt-safe">
        <h2 className="text-xl md:text-lg font-bold">Tin nhắn</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => {
            setOpen(false);
            setActivePanel(null);
          }}
        >
          <X size={24} className="md:w-5 md:h-5 text-gray-600" />
        </button>
      </div>

      {/* DANH SÁCH: Cuộn mượt và trừ đi chiều cao header */}
      <div className="overflow-y-auto h-[calc(100vh-5rem)] md:h-[calc(100vh-11rem)] pb-24 md:pb-4">
        {formattedConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Bạn chưa có cuộc trò chuyện nào.</p>
          </div>
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