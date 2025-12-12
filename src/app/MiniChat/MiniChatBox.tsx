"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Send, X } from "lucide-react";
import Image from "next/image";

type MiniChatProps = {
  partnerId: string;
  onClose: () => void;
  onReadMessages: () => void; // callback cập nhật SidebarLeft
  onNewConversation: (conversation: {
    partner_id: string;
    username: string;
    avatar_url: string;
    last_message: string;
    last_time: string;
    is_read: boolean;
  }) => void; // callback thêm vào MessengerPanel
};

interface User {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string | null;
  type: string | null;
  is_read: boolean | null;
}

export default function MiniChatBox({
  partnerId,
  onClose,
  onReadMessages,
  onNewConversation,
}: MiniChatProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ⭐ Lấy user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  // ⭐ Đánh dấu đã đọc khi mở MiniChat
  useEffect(() => {
    if (!partnerId || !currentUserId) return;

    const markRead = async () => {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);

      onReadMessages(); // cập nhật SidebarLeft
    };

    markRead();
  }, [partnerId, currentUserId, onReadMessages]);

  // ⭐ Load thông tin user đối phương
  useEffect(() => {
    const fetchPartner = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .eq("id", partnerId)
        .single();

      if (data) setPartner(data as User);
    };

    fetchPartner();
  }, [partnerId]);

  // ⭐ Load tin nhắn + Realtime
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: true });

      const filtered = data?.filter(
        (msg: Message) =>
          (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
          (msg.sender_id === partnerId && msg.receiver_id === currentUserId)
      );

      if (filtered) setMessages(filtered);
    };

    fetchMessages();

    // ⭐ Realtime CHUẨN
    const channel = supabase
      .channel(`mini-chat-realtime-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new as Message;

          const isRelated =
            (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === currentUserId);

          if (!isRelated) return;

          setMessages((prev) => [...prev, msg]);

          // Nếu đối phương gửi → đánh dấu đã đọc
          if (msg.sender_id === partnerId) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", msg.id);

            onReadMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, onReadMessages]);

  // ⭐ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ Gửi tin nhắn
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: partnerId,
      content: newMessage.trim(),
      is_read: false,
    });

    // ✅ Nếu đây là tin nhắn đầu tiên → gọi callback thêm vào MessengerPanel
    if (messages.length === 0 && partner) {
      onNewConversation({
        partner_id: partner.id,
        username: partner.username || "Unknown",
        avatar_url: partner.avatar_url || "/default-avatar.png",
        last_message: newMessage.trim(),
        last_time: new Date().toISOString(),
        is_read: true,
      });
    }

    setNewMessage("");
  };

  const formatTime = (t: string | null) => {
    if (!t) return "--:--";
    const d = new Date(t);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  if (!partner) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl flex flex-col z-[999]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <Image
            src={partner.avatar_url || "/default-avatar.png"}
            width={35}
            height={35}
            alt="avatar"
            className="rounded-full"
          />
          <div className="font-semibold text-sm">{partner.username}</div>
        </div>
        <button onClick={onClose} className="cursor-pointer">
          <X size={18} />
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender_id === currentUserId ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                msg.sender_id === currentUserId
                  ? "bg-white text-gray-900 rounded-br-none"
                  : "bg-blue-100 text-blue-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">
              {formatTime(msg.created_at)}
            </span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 px-3 py-2 bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-1.5 text-sm border rounded-full"
        />
        <button
          type="submit"
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
