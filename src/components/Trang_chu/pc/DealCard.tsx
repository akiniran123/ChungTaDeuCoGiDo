"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/app/context/CartContext";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import DealActions from "./DealCard/DealActions";
import DealHeader from "./DealCard/DealHeader";

export type DealType = {
  id: string;
  title: string;
  content?: string;
  image?: string;
  media?: string[];
  votes?: number;
  comments?: number;
  category?: string;

  author?: string;
  author_id?: string;
  avatar?: string;
  createdAt?: string;

  community_title?: string | null;
  community_avatar_url?: string | null;

  tags?: string[];
  product_tags?: string[];
};

export interface DealCardProps {
  deal: DealType;
  vote: (id: string, delta: number) => void;
  setSelectedDeal: (id: string) => void;
  bigger?: boolean;
  isAd?: boolean;

  // ⭐ PROP QUAN TRỌNG
  onTagClick?: (tag: string) => void;
}

const DealCard: React.FC<DealCardProps> = ({
  deal,
  vote,
  setSelectedDeal,
  bigger = false,
  isAd = false,
  onTagClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(deal.votes ?? 0);
  const [commentCount, setCommentCount] = useState<number>(deal.comments ?? 0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const mediaList =
    deal.media?.length ? deal.media : deal.image ? [deal.image] : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("product_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", deal.id)
        .maybeSingle();

      setLiked(!!data);
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

  useEffect(() => {
    if (!chatOpen) return;

    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select(`
          id, content, created_at,
          users ( username, avatar_url )
        `)
        .eq("product_id", deal.id)
        .order("created_at", { ascending: true });

      const formatted =
        data?.map((m: any) => ({
          id: m.id,
          content: m.content || "",
          username: m.users?.username || "Người dùng",
          avatar: m.users?.avatar_url || "/default-avatar.png",
        })) || [];

      setMessages(formatted);
      setCommentCount(formatted.length);
    };

    fetchComments();
  }, [chatOpen, deal.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Hãy đăng nhập!");

    const msg = newMessage.trim();

    setMessages((prev) => [
      ...prev,
      { content: msg, username: user.email, avatar: "/default-avatar.png" },
    ]);
    setNewMessage("");
    setCommentCount((prev) => prev + 1);

    await supabase.from("comments").insert({
      product_id: deal.id,
      user_id: user.id,
      content: msg,
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const DealMedia = () => (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {mediaList.length > 0 && (
        <img
          src={mediaList[currentIndex] || "/default.png"}
          alt={deal.title}
          className="object-cover w-full h-auto"
        />
      )}

      {mediaList.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-1 rounded-full"
            onClick={prevMedia}
          >
            <ArrowLeft size={20} />
          </button>

          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-1 rounded-full"
            onClick={nextMedia}
          >
            <ArrowRight size={20} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          setSelectedDeal(deal.id);
        }}
        className="cursor-pointer"
      >
        <article
          className={`flex flex-col mx-auto rounded-lg shadow ${
            bigger ? "max-w-3xl" : "max-w-xl"
          } ${isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"}`}
          id={`deal-${deal.id}`}
        >
          <div className="px-3 py-2 flex justify-between items-start w-full">
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <DealHeader deal={deal} />
            </div>

            <div className="flex flex-col items-end gap-2 ml-3">
              {(deal.tags?.length || deal.product_tags?.length) && (
                <div className="flex flex-wrap justify-end gap-2 max-w-[160px]">

                  {/* ⭐⭐⭐ TAG CLICK — ĐÃ SỬA + GIỮ NGUYÊN STYLE */}
                  {deal.tags?.map((tag, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(tag); // ⭐ GỌI LỌC TAG
                      }}
                      className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full hover:bg-pink-100"
                    >
                      {tag}
                    </button>
                  ))}

                  {deal.product_tags?.map((tag, i) => (
                    <button
                      key={`pt-${i}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(tag); // ⭐ GỌI LỌC TAG
                      }}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {deal.community_title && (
                <div className="flex items-center gap-2">
                  {deal.community_avatar_url && (
                    <img
                      src={deal.community_avatar_url}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-medium text-blue-600">
                    {deal.community_title}
                  </span>
                </div>
              )}
            </div>
          </div>

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
      </div>

      {chatOpen && (
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
            <div ref={messagesEndRef} />
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
      )}
    </>
  );
};

export default DealCard;
