"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Send, X } from "lucide-react";
import Image from "next/image";

type MiniChatProps = {
  partnerId: string;
  index?: number; // thêm index để offset
  onClose: () => void;
  onReadMessages: () => void;
  onNewConversation: (conversation: {
    partner_id: string;
    username: string;
    avatar_url: string;
    last_message: string;
    last_time: string;
    is_read: boolean;
  }) => void;
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
  index = 0,
  onClose,
  onReadMessages,
  onNewConversation,
}: MiniChatProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ⭐ Lấy user ID hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) setCurrentUserId(data.user.id);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchUser();
  }, []);

  // ⭐ Đánh dấu đã đọc khi mở MiniChat
  useEffect(() => {
    if (!partnerId || !currentUserId) return;

    const markRead = async () => {
      try {
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("sender_id", partnerId)
          .eq("receiver_id", currentUserId)
          .eq("is_read", false);

        onReadMessages();
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    };

    markRead();
  }, [partnerId, currentUserId, onReadMessages]);

  // ⭐ Lấy thông tin partner
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .eq("id", partnerId)
          .single();
        if (error) throw error;
        if (data) setPartner(data as User);
      } catch (err) {
        console.error("Error fetching partner info:", err);
      }
    };

    fetchPartner();
  }, [partnerId]);

  // ⭐ Load tin nhắn + realtime
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const fetchMessages = async () => {
      try {
        // fetch tin nhắn gửi đi
        const { data: sentMsgs, error: sentErr } = await supabase
          .from("messages")
          .select("*")
          .eq("sender_id", currentUserId)
          .eq("receiver_id", partnerId);
        if (sentErr) console.error("Supabase sentMsgs error:", sentErr);

        // fetch tin nhắn nhận về
        const { data: recvMsgs, error: recvErr } = await supabase
          .from("messages")
          .select("*")
          .eq("sender_id", partnerId)
          .eq("receiver_id", currentUserId);
        if (recvErr) console.error("Supabase recvMsgs error:", recvErr);

        const allMessages = [...(sentMsgs ?? []), ...(recvMsgs ?? [])].sort(
          (a, b) =>
            new Date(a.created_at || "").getTime() -
            new Date(b.created_at || "").getTime()
        );

        setMessages(allMessages);
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
      }
    };

    fetchMessages();

    // --- Realtime listener
    const channel = supabase
      .channel(`mini-chat-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          try {
            const msg = payload.new as Message;
            const isRelated =
              (msg.sender_id === currentUserId &&
                msg.receiver_id === partnerId) ||
              (msg.sender_id === partnerId &&
                msg.receiver_id === currentUserId);
            if (!isRelated) return;

            setMessages((prev) => [...prev, msg]);

            // đánh dấu đã đọc nếu là tin nhắn từ partner
            if (msg.sender_id === partnerId) {
              await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", msg.id);
              onReadMessages();
            }
          } catch (err) {
            console.error("Error handling realtime message:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, onReadMessages]);

  // ⭐ Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ Gửi tin nhắn
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    try {
      await supabase.from("messages").insert({
        sender_id: currentUserId,
        receiver_id: partnerId,
        content: newMessage.trim(),
        is_read: false,
      });

      if ((messages?.length ?? 0) === 0 && partner) {
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
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
    <div
      className="fixed bottom-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl flex flex-col z-[999]"
      style={{ right: 4 + index * 340 + "px" }}
    >
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
        {messages?.map((msg) => (
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

