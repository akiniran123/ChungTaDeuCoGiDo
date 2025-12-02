"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Send, X } from "lucide-react";
import Image from "next/image";

type MiniChatProps = {
  partnerId: string;
  onClose: () => void;
};

export default function MiniChatBox({ partnerId, onClose }: MiniChatProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [partner, setPartner] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // GET CURRENT USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setCurrentUserId(data.user.id);
    };
    getUser();
  }, []);

  // LOAD PARTNER INFO
  useEffect(() => {
    if (!partnerId) return;

    const fetchPartner = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .eq("id", partnerId)
        .single();

      setPartner(data);
    };

    fetchPartner();
  }, [partnerId]);

  // LOAD MESSAGES + REALTIME
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),
           and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime
    const channel = supabase
      .channel("mini-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          if (
            (msg.sender_id === currentUserId &&
              msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId &&
              msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    // 🟢 FIXED: Cleanup synchronous, not async
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId]);

  // SCROLL TO BOTTOM
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: partnerId,
      content: newMessage.trim(),
      is_read: false,
    });

    setNewMessage("");
  };

  const formatTime = (t: string) => {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  if (!partner) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[420px] bg-white shadow-2xl rounded-xl border flex flex-col z-[999]">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-white rounded-t-xl">
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

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
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
                  ? "bg-pink-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>

            <span className="text-[10px] text-gray-400 mt-1">
              {formatTime(msg.created_at)}
            </span>
          </div>
        ))}

        <div ref={scrollRef}></div>
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 px-3 py-2 border-t bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-1.5 text-sm border rounded-full focus:ring-1 focus:ring-pink-500 focus:outline-none"
        />

        <button
          type="submit"
          className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
