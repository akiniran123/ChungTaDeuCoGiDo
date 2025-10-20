"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart as HeartIcon, MessageSquare, Share2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

interface CommentWithUser extends CommentRow {
  user: {
    username: string;
    avatar_url?: string | null;
  };
}

type Props = {
  productId: string;
};

export default function ProductActions({ productId }: Props) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: productData } = await supabase
        .from("products")
        .select("upvotes")
        .eq("id", productId)
        .single();

      if (productData) setLikesCount(productData.upvotes ?? 0);

      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData.user?.id;

      const { data: commentsData } = await supabase
        .from("comments")
        .select(`
          id,
          product_id,
          content,
          created_at,
          user_id,
          users (
            username,
            avatar_url
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: true });

      if (commentsData) {
        const mapped: CommentWithUser[] = commentsData.map((c: any) => ({
          id: c.id,
          product_id: c.product_id,
          user_id: c.user_id,
          content: c.content || "",
          created_at: c.created_at,
          user: {
            username: c.users?.username || "Người dùng",
            avatar_url: c.users?.avatar_url || "/default-avatar.png",
          },
        }));
        setComments(mapped);

        if (currentUserId) {
          const userLiked = mapped.some(
            (c) => c.user_id === currentUserId && c.content === "like"
          );
          setLiked(userLiked);
        }
      }
    }

    fetchData();
  }, [productId]);

  const handleToggleLike = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    if (liked) {
      await supabase
        .from("products")
        .update({ upvotes: likesCount - 1 })
        .eq("id", productId);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      setLiked(false);
    } else {
      await supabase
        .from("products")
        .update({ upvotes: likesCount + 1 })
        .eq("id", productId);
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleToggleCommentSidebar = () =>
    setShowCommentSidebar((prev) => !prev);

  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const { data: inserted } = await supabase
      .from("comments")
      .insert({ product_id: productId, user_id: currentUserId, content })
      .select(
        `
        id,
        product_id,
        content,
        created_at,
        user_id,
        users (
          username,
          avatar_url
        )
      `
      )
      .single();

    if (inserted) {
      const newC: CommentWithUser = {
        id: inserted.id,
        product_id: inserted.product_id,
        user_id: inserted.user_id,
        content: inserted.content || "",
        created_at: inserted.created_at,
        user: {
          username: inserted.users?.username || "Người dùng",
          avatar_url:
            inserted.users?.avatar_url || "/default-avatar.png",
        },
      };
      setComments((prev) => [...prev, newC]);
      setNewComment("");
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/may-tinh-PC-day-du/${productId}`;
    if (navigator.share) {
      navigator.share({ title: "Xem sản phẩm", url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã copy link sản phẩm!");
    }
  };

  return (
    <>
      {/* ✅ Gói 3 nút trong khung riêng, căn giữa, tránh tràn */}
      <div className="flex items-center justify-center gap-2 mt-auto w-full text-gray-700 text-sm relative">
        <button
          onClick={handleToggleLike}
          className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full shadow-sm transition-colors min-w-[60px] ${
            liked
              ? "bg-pink-100 text-pink-600"
              : "bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600"
          }`}
        >
          <HeartIcon size={16} fill={liked ? "currentColor" : "none"} />
          <span className="text-xs font-semibold">{likesCount}</span>
        </button>

        <button
          onClick={handleToggleCommentSidebar}
          className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-gray-100 shadow-sm text-gray-600 hover:bg-pink-100 hover:text-pink-600 min-w-[60px]"
        >
          <MessageSquare size={16} />
          <span className="text-xs font-semibold">{comments.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-gray-100 shadow-sm text-gray-600 hover:bg-pink-100 hover:text-pink-600 min-w-[60px]"
        >
          <Share2 size={16} />
        </button>
      </div>

      {showCommentSidebar && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg z-[9999] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg">Bình luận</h2>
            <button
              onClick={handleToggleCommentSidebar}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm">
                Chưa có bình luận nào.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2 items-start">
                <img
                  src={c.user.avatar_url || "/default-avatar.png"}
                  alt={c.user.username}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="bg-gray-100 p-2 rounded text-sm flex-1">
                  <span className="font-semibold text-gray-700 block">
                    {c.user.username}
                  </span>
                  <span>{c.content}</span>
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSendComment}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
