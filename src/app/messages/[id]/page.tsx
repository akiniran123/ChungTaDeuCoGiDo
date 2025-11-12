"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

type Contact = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  last_message?: string;
  last_time?: string;
};

export default function ChatDetailPage() {
  const { id: partnerId } = useParams() as { id: string };
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [partner, setPartner] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // -------------------------------
  // Lấy user hiện tại
  // -------------------------------
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setCurrentUserId(data.user.id);
    };
    getUser();
  }, []);

  // -------------------------------
  // Lấy danh sách người nhắn (contacts)
  // -------------------------------
  useEffect(() => {
    if (!currentUserId) return;

    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
            sender_id,
            receiver_id,
            content,
            created_at,
            sender:sender_id(username, avatar_url),
            receiver:receiver_id(username, avatar_url)
          `
        )
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error || !data) return;

      const contactMap: Record<string, Contact> = {};
      data.forEach((msg: any) => {
        const otherId =
          msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        if (!contactMap[otherId]) {
          const userInfo =
            msg.sender_id === currentUserId ? msg.receiver : msg.sender;
          contactMap[otherId] = {
            id: otherId,
            username: userInfo?.username || "Người dùng",
            avatar_url: userInfo?.avatar_url || "/default-avatar.png",
            last_message: msg.content,
            last_time: msg.created_at,
          };
        }
      });

      setContacts(Object.values(contactMap));
    };

    fetchContacts();
  }, [currentUserId]);

  // -------------------------------
  // Lấy thông tin người chat hiện tại
  // -------------------------------
  useEffect(() => {
    const fetchPartner = async () => {
      if (!partnerId) return;
      const { data } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .eq("id", partnerId)
        .single();
      setPartner(data);
    };
    fetchPartner();
  }, [partnerId]);

  // -------------------------------
  // Lấy toàn bộ tin nhắn giữa 2 người
  // -------------------------------
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data);
    };

    fetchMessages();

    // Realtime
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === currentUserId &&
              msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId]);

  // -------------------------------
  // Gửi tin nhắn
  // -------------------------------
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: partnerId,
      content: newMessage.trim(),
      is_read: false,
    });

    if (!error) setNewMessage("");
  };

  // -------------------------------
  // Auto scroll khi có tin mới
  // -------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------
  // Format thời gian
  // -------------------------------
  const formatTime = (time: string | null) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} | ${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  };

  // -------------------------------
  // Giao diện
  // -------------------------------
  if (!partner) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white">
      {/* Cột chat chi tiết */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Image
              src={partner?.avatar_url || "/default-avatar.png"}
              alt="avatar"
              width={44}
              height={44}
              className="rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-800">
                {partner?.username || "Người dùng"}
              </div>
              <div className="text-xs text-gray-400">Đang hoạt động</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-sm">
              💬 Chưa có tin nhắn nào
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender_id === currentUserId ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[65%] text-[15px] leading-snug shadow-sm ${
                  msg.sender_id === currentUserId
                    ? "bg-pink-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[11px] text-gray-400 mt-1">
                {formatTime(msg.created_at)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 px-6 py-3 border-t bg-white"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-gray-900"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Cột danh sách contacts (bên phải) */}
<div className="w-80 border-l border-gray-200 overflow-y-auto bg-gray-50">
  {/* Header */}
  <div className="flex items-center px-6 py-3 border-b bg-white shadow-sm sticky top-4 z-10">
    <h2 className="text-lg font-semibold">Tin nhắn</h2>
  </div>

  {/* Danh sách contacts, thêm margin-top để đẩy xuống */}
  <div className="mt-8"> {/* tăng mt-? càng lớn, item càng xuống */}
    {contacts.map((contact) => (
      <div
        key={contact.id}
        onClick={() => router.push(`/messages/${contact.id}`)}
        className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-100 ${
          contact.id === partnerId ? "bg-white font-semibold" : ""
        }`}
      >
        <Image
          src={contact.avatar_url || "/default-avatar.png"}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full"
        />
        <div className="flex-1 truncate">
          <div className="truncate">{contact.username}</div>
          {contact.last_message && (
            <div className="text-xs text-gray-400 truncate">
              {contact.last_message}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
