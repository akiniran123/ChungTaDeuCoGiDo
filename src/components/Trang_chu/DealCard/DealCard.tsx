"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/app/context/CartContext";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import DealActions from "@/components/Trang_chu/DealCard/DealActions";
import DealHeader from "@/components/Trang_chu/DealCard/DealHeader"; // ✅ có link tới user detail

// =======================================================
// ========== KIỂU DỮ LIỆU DEAL ==========================
// =======================================================
export type DealType = {
  id: string;
  title: string;
  content?: string;
  image?: string;
  media?: string[];
  votes?: number;
  comments?: number;
  category?: string;

  // ✅ Giữ cho DealHeader hoạt động
  author?: string; // tên người đăng
  avatar?: string; // ảnh đại diện
  createdAt?: string; // ngày tạo (camelCase cho TS)
};

// =======================================================
// ========== DEAL CARD COMPONENT ========================
// =======================================================
export interface DealCardProps {
  deal: DealType;
  vote: (id: string, delta: number) => void;
  setSelectedDeal: (id: string) => void;
  bigger?: boolean;
  isAd?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({
  deal,
  vote,
  setSelectedDeal,
  bigger = false,
  isAd = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(deal.votes ?? 0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [commentCount, setCommentCount] = useState<number>(deal.comments ?? 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // ------------------- MEDIA -------------------
  const mediaList =
    deal.media && deal.media.length > 0
      ? deal.media
      : deal.image
      ? [deal.image]
      : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleTouchStart = (e: React.TouchEvent) =>
    setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? prevMedia() : nextMedia();
    setStartX(null);
  };

  // ------------------- SAVE -------------------
  const handleSave = () => {
    setSaved(!saved);
    addToCart({
      id: deal.id,
      name: deal.title,
      price: 0,
      image: deal.image || "",
      quantity: 1,
    });
  };

  // ------------------- LIKE -------------------
  useEffect(() => {
    const fetchLikeStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("product_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", deal.id)
        .maybeSingle();
      setLiked(!!data && !error);
    };
    fetchLikeStatus();
  }, [deal.id]);

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Bạn cần đăng nhập để like!");

    if (!liked) {
      const { error } = await supabase.from("product_likes").insert({
        user_id: user.id,
        product_id: deal.id,
      });
      if (!error) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } else {
      const { error } = await supabase
        .from("product_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", deal.id);
      if (!error) {
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  // ------------------- COMMENTS -------------------
  useEffect(() => {
    if (chatOpen) {
      const fetchComments = async () => {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            id, content, created_at,
            users ( username, avatar_url )
          `)
          .eq("product_id", deal.id)
          .order("created_at", { ascending: true });

        if (!error && data) {
          const formatted = data.map((msg: any) => ({
            id: msg.id,
            content: msg.content || "",
            username: msg.users?.username || "Người dùng",
            avatar: msg.users?.avatar_url || "/default-avatar.png",
          }));
          setMessages(formatted);
          setCommentCount(formatted.length);
        }
      };
      fetchComments();
    }
  }, [chatOpen, deal.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const content = newMessage.trim();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return console.error("Chưa đăng nhập!");

    setMessages((prev) => [
      ...prev,
      { content, username: user.email, avatar: "/default-avatar.png" },
    ]);
    setNewMessage("");
    setCommentCount((prev) => prev + 1);

    await supabase.from("comments").insert({
      product_id: deal.id,
      user_id: user.id,
      content,
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------- DEAL MEDIA -------------------
  const DealMedia = () => (
    <div
      className="relative w-full overflow-hidden bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {mediaList.length > 0 && (
        <img
  src={(mediaList[currentIndex] || "/default.png").replace(/"/g, "")}
  alt={deal.title}
  className="object-cover w-full h-auto"
/>

      )}
      {mediaList.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
            onClick={prevMedia}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1"
            onClick={nextMedia}
          >
            <ArrowRight size={20} />
          </button>
        </>
      )}
    </div>
  );

  // ------------------- DEAL CHAT -------------------
  const DealChat = () => (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l flex flex-col z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold text-gray-800">Bình luận</h3>
        <button onClick={() => setChatOpen(false)} className="text-gray-500">
          <X />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-2">
            <img
              src={msg.avatar}
              alt={msg.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{msg.username}</p>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Nhập bình luận..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );

  // =======================================================
  // ========== RENDER CHÍNH ================================
  // =======================================================
  return (
    <>
      <article
        className={`flex flex-col transition-all mx-auto rounded-lg shadow ${
          bigger ? "max-w-3xl" : "max-w-xl"
        } ${isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"}`}
        id={`deal-${deal.id}`}
      >
        <DealHeader deal={deal} />

        <DealMedia />

        {!isAd && (
          <DealActions
            liked={liked}
            likesCount={likesCount}
            commentCount={commentCount}
            saved={saved}
            handleLike={handleLike}
            handleSave={handleSave}
            toggleChat={() => setChatOpen(!chatOpen)}
            deal={deal}
          />
        )}
      </article>

      {chatOpen && <DealChat />}
    </>
  );
};

export default DealCard;
