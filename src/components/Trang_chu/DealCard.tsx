"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  Heart as HeartIcon,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";

export type DealType = {
  id: string;
  title: string;
  image?: string;
  media?: string[];
  votes: number;
  comments?: number;
  category: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt?: string;
};

export interface DealCardProps {
  deal: DealType;
  vote: (id: string, delta: number) => void;
  setSelectedDeal: (id: string) => void;
  bigger?: boolean;
  isAd?: boolean;
}

interface MessageType {
  id?: string;
  content: string;
  username?: string;
  avatar?: string;
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
  const [showLightbox, setShowLightbox] = useState(false);
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(deal.votes || 0);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [commentCount, setCommentCount] = useState(deal.comments || 0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mediaList =
    deal.media && deal.media.length > 0 ? deal.media : deal.image ? [deal.image] : [];

  const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? prevMedia() : nextMedia();
    setStartX(null);
  };

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

  // ✅ Đồng bộ trạng thái like từ Supabase
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

      if (data && !error) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    };

    fetchLikeStatus();
  }, [deal.id]);

  // ✅ Xử lý Like / Unlike (đồng bộ Supabase)
  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Bạn cần đăng nhập để like!");
      return;
    }

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
        setLikesCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  // ✅ Fetch bình luận kèm user info
  useEffect(() => {
    if (chatOpen) {
      const fetchComments = async () => {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            users (
              username,
              avatar_url
            )
          `)
          .eq("product_id", deal.id)
          .order("created_at", { ascending: true });

        if (!error && data) {
          const cleanData: MessageType[] = data.map((msg: any) => ({
            id: msg.id,
            content: msg.content || "",
            username: msg.users?.username || "Người dùng",
            avatar: msg.users?.avatar_url || "/default-avatar.png",
          }));
          setMessages(cleanData);
          setCommentCount(cleanData.length);
        }
      };
      fetchComments();
    }
  }, [chatOpen, deal.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const content = newMessage.trim();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Chưa đăng nhập!");
      return;
    }

    setMessages((prev) => [...prev, { content, username: user.email, avatar: "/default-avatar.png" }]);
    setNewMessage("");
    setCommentCount((prev) => prev + 1);

    const { error } = await supabase.from("comments").insert({
      product_id: deal.id,
      user_id: user.id,
      content,
    });
    if (error) console.error(error);
  };

  return (
    <>
      {/* Card chính */}
      <article
        className={`flex flex-col transition-all mx-auto rounded-lg shadow ${
          bigger ? "max-w-3xl" : "max-w-xl"
        } ${isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"}`}
        id={`deal-${deal.id}`}
      >
        {/* header */}
        <div className="flex flex-col px-3 py-2 border-b">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/user/${deal.author}`}
              className="flex items-center gap-2 !text-gray-700 !no-underline hover:!text-gray-900"
            >
              <img
                src={deal.avatar || "/default-avatar.png"}
                alt={deal.author}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="font-semibold">{deal.author}</span>
            </Link>
            <span className="text-gray-500 font-normal">· {deal.createdAt}</span>
          </div>
          <Link
            href={`/deal/${deal.id}`}
            className="block mt-2 no-underline hover:text-pink-600 transition-colors"
          >
            <h3 className="font-semibold text-base md:text-lg">{deal.title}</h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2">{deal.content}</p>
        </div>

        {/* media */}
        <div
          className="relative w-full overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {mediaList.length > 0 && (
            <>
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {mediaList.map((item, idx) =>
                  item.endsWith(".mp4") ? (
                    <video
                      key={idx}
                      src={item}
                      controls={!isAd}
                      className={`object-cover w-full flex-shrink-0 rounded-md ${
                        bigger ? "h-[600px]" : "h-96"
                      }`}
                    />
                  ) : (
                    <img
                      key={idx}
                      src={item}
                      alt={deal.title}
                      className={`object-cover w-full flex-shrink-0 rounded-md ${
                        bigger ? "h-[600px]" : "h-96"
                      }`}
                      onClick={() => setShowLightbox(true)}
                    />
                  )
                )}
              </div>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/90 bg-black/10 backdrop-blur-sm border border-white/5 rounded-full p-3 shadow-sm hover:bg-black/25"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/90 bg-black/10 backdrop-blur-sm border border-white/5 rounded-full p-3 shadow-sm hover:bg-black/25"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>

        {/* actions */}
        {!isAd && (
          <div className="flex items-center justify-between gap-2 mt-3 text-sm text-gray-700 pl-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button
                  onClick={handleLike}
                  className={`p-1 cursor-pointer transition-colors ${
                    liked ? "text-pink-600" : "text-gray-600 hover:text-pink-600"
                  }`}
                >
                  <HeartIcon size={16} fill={liked ? "currentColor" : "none"} />
                </button>
                <span className="font-semibold text-xs text-center min-w-[20px]">{likesCount}</span>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className="hover:text-pink-600 p-1 cursor-pointer"
                >
                  <MessageSquare size={16} />
                </button>
                <span className="font-semibold text-xs text-center min-w-[20px]">{commentCount}</span>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button
                  onClick={() => {
                    const url = `${window.location.href}#deal-${deal.id}`;
                    if (navigator.share) navigator.share({ title: deal.title, url });
                    else {
                      navigator.clipboard.writeText(url);
                      alert("Đã copy link: " + url);
                    }
                  }}
                  className="hover:text-pink-600 p-1 cursor-pointer"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm mr-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`hover:text-pink-600 p-1 cursor-pointer ${saved ? "text-pink-600" : ""}`}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Chat box */}
      {chatOpen && (
        <div className="fixed right-0 top-0 h-full w-[320px] bg-white shadow-lg border-l z-[9999] flex flex-col">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-gray-700">Bình luận</span>
            <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.length === 0 && <p className="text-gray-400 text-sm">Chưa có bình luận</p>}
            {messages.map((msg, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <img
                  src={msg.avatar || "/default-avatar.png"}
                  alt={msg.username || "Người dùng"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="bg-gray-100 p-2 rounded-md text-sm flex-1">
                  <span className="font-semibold text-gray-700 block">{msg.username || "Người dùng"}</span>
                  <span>{msg.content}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập bình luận..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
            />
            <button
              onClick={handleSendMessage}
              className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DealCard;
