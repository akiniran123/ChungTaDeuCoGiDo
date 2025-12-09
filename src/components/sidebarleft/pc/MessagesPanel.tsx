"use client";

import { createPortal } from "react-dom";

export type Conversation = {
  partner_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_time: string; // luôn là string để tránh lỗi
};

type MessagesPanelProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: Conversation[];
  onSelect: (partnerId: string) => void;
  activePanel: string | null; // ✅ bổ sung
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>; // ✅ bổ sung
};

export default function MessagesPanel({
  open,
  setOpen,
  conversations,
  onSelect,
  activePanel,
  setActivePanel,
}: MessagesPanelProps) {
  return createPortal(
    <div
      className={`
        fixed top-[6.5rem] left-64
        w-80 h-[calc(100vh-6.5rem)]
        bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300
        ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}
        z-[999999]
      `}
    >
      <div className="p-4 font-semibold flex justify-between">
        Tin nhắn
        <button
          onClick={() => {
            setOpen(false);
            setActivePanel(null); // ✅ reset panel khi đóng
          }}
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto h-full">
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">
            Bạn chưa có cuộc trò chuyện nào.
          </p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.partner_id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(c.partner_id);
                setActivePanel("messages"); // ✅ đánh dấu panel đang mở
              }}
            >
              <img src={c.avatar_url} className="w-10 h-10 rounded-full" />

              <div className="flex-1">
                <p className="font-medium">{c.username}</p>
                <p className="text-sm text-gray-500">{c.last_message}</p>
              </div>

              <span className="text-[11px] text-gray-400 whitespace-nowrap">
                {new Date(c.last_time).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  );
}