"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, X, User as UserIcon } from "lucide-react";
import type {
  Message,
  User,
} from "@/components/MiniChat/MiniChatBox/type/types";

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
  messages = [],
  currentUserId,
  newMessage,
  setNewMessage,
  onSend,
  onClose,
  index = 0,
  loading,
}: Props) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    console.log("[MiniChatView] partner:", partner);
    console.log("[MiniChatView] messages length:", messages?.length ?? 0);
    if (messages && messages.length > 0) {
      console.log("[MiniChatView] first message sample:", messages[0]);
    }
  }, [partner, messages]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 50);
    return () => window.clearTimeout(t);
  }, [messages]);

  const formatTime = (t: string | null | undefined) => {
    if (!t) return "--:--";
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    return d.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const avatarSrc =
    !avatarError && partner?.avatar_url
      ? partner.avatar_url
      : "/default-avatar.png";

  const displayMessages = messages.length > 0 ? messages : [];

  return (
    <div
      className="fixed bottom-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl flex flex-col z-[999]"
      style={{ right: 4 + index * 340 + "px" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-white">
        {/* AVATAR + USERNAME */}
        {partner ? (
          <Link
            href={`/profile/${partner.id}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            {avatarSrc === "/default-avatar.png" ? (
              <div className="w-[35px] h-[35px] rounded-full border border-gray-200 bg-white flex items-center justify-center">
                <UserIcon size={18} className="text-gray-400" />
              </div>
            ) : (
              <Image
                src={avatarSrc}
                width={35}
                height={35}
                alt="avatar"
                className="rounded-full border border-gray-200 bg-white"
                onError={() => setAvatarError(true)}
              />
            )}

            {/* ✅ CHỈNH MÀU USERNAME Ở ĐÂY */}
            <div className="font-semibold text-sm text-gray-900 hover:text-gray-700">
              {partner.username}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-[35px] h-[35px] rounded-full border border-gray-200 bg-white flex items-center justify-center">
              <UserIcon size={18} className="text-gray-400" />
            </div>
            <div className="font-semibold text-sm text-gray-400">
              Đang tải...
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close chat"
          className="cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* BODY */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-3"
      >
        <div className="text-[11px] text-gray-400 mb-2">
          <div>Debug: messages.length = {messages?.length ?? 0}</div>
          <div>partner loaded = {partner ? "yes" : "no"}</div>
        </div>

        <div className="bg-white p-2 rounded border text-xs text-gray-600 mb-2">
          <strong>Debug raw</strong>
          <div>currentUserId: {String(currentUserId)}</div>
          <div>partnerId: {partner?.id ?? "null"}</div>
          <details className="mt-1">
            <summary className="cursor-pointer text-blue-600">
              Show raw messages JSON
            </summary>
            <pre className="whitespace-pre-wrap text-[11px] max-h-40 overflow-auto">
              {JSON.stringify(messages, null, 2)}
            </pre>
          </details>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-gray-500">
            Đang tải cuộc trò chuyện...
          </div>
        ) : displayMessages.length > 0 ? (
          displayMessages.map((msg, idx) => (
            <div
              key={(msg as Message).id ?? idx}
              className={`flex flex-col ${
                msg.sender_id === currentUserId
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                  msg.sender_id === currentUserId
                    ? "bg-white text-gray-900 rounded-br-none"
                    : "bg-blue-100 text-blue-800 rounded-bl-none"
                }`}
              >
                {msg.content ?? "(no content)"}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {formatTime(msg.created_at ?? null)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">
            Chưa có tin nhắn
          </div>
        )}
      </div>

      {/* INPUT */}
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
          placeholder={
            partner
              ? "Nhập tin nhắn..."
              : "Không thể gửi khi chưa tải xong"
          }
          className="flex-1 px-3 py-1.5 text-sm border rounded-full"
          disabled={!partner}
        />
        <button
          type="submit"
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          disabled={!partner}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
