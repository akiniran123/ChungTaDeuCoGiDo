// src/components/MiniChat/MiniChatView.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Send, X } from "lucide-react";
import type { Message, User } from "./useMiniChat";

type Props = {
  partner: User | null;
  messages: Message[];
  currentUserId: string | null;
  newMessage: string;
  setNewMessage: (v: string) => void;
  onSend: (content: string) => Promise<void>;
  onClose: () => void;
  onMarkRead?: () => void;
  index?: number;
  loading?: boolean;
};

export default function MiniChatView({
  partner,
  messages,
  currentUserId,
  newMessage,
  setNewMessage,
  onSend,
  onClose,
  index = 0,
  loading,
}: Props) {
  const formatTime = (t: string | null) => {
    if (!t) return "--:--";
    const d = new Date(t);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed bottom-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl flex flex-col z-[999]"
      style={{ right: 4 + index * 340 + "px" }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <Image
            src={(partner && partner.avatar_url) || "/default-avatar.png"}
            width={35}
            height={35}
            alt="avatar"
            className="rounded-full"
          />
          <div className="font-semibold text-sm">{partner ? partner.username : "Đang tải..."}</div>
        </div>
        <button onClick={onClose} className="cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-3">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Đang tải cuộc trò chuyện...</div>
        ) : partner ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender_id === currentUserId ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                  msg.sender_id === currentUserId ? "bg-white text-gray-900 rounded-br-none" : "bg-blue-100 text-blue-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.created_at)}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">Không có người nhận</div>
        )}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newMessage.trim()) return;
          await onSend(newMessage.trim());
          setNewMessage("");
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={partner ? "Nhập tin nhắn..." : "Không thể gửi khi chưa tải xong"}
          className="flex-1 px-3 py-1.5 text-sm border rounded-full"
          disabled={!partner}
        />
        <button type="submit" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" disabled={!partner}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}