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

  // ✅ Lấy dữ liệu ban đầu (like + bình luận)
  useEffect(() => {
    async function fetchData() {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData.user?.id;

      // --- Lấy tổng số lượt like ---
      const { count } = await supabase
        .from("product_likes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);
      setLikesCount(count ?? 0);

      // --- Kiểm tra user đã like chưa ---
      if (currentUserId) {
        const { data: likeData } = await supabase
          .from("product_likes")
          .select("id")
          .eq("product_id", productId)
          .eq("user_id", currentUserId)
          .maybeSingle();

        setLiked(!!likeData);
      }

      // --- Lấy bình luận ---
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
      }
    }

    fetchData();
  }, [productId]);

  // ✅ Xử lý thả tim (thêm/xóa trong bảng product_likes)
  const handleToggleLike = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    if (liked) {
      // Bỏ like
      const { error } = await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", currentUserId);

      if (!error) {
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      }
    } else {
      // Thả tim
      const { error } = await supabase
        .from("product_likes")
        .insert({ product_id: productId, user_id: currentUserId });

      if (!error) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    }
  };

  // ✅ Hiện/ẩn sidebar bình luận
  const handleToggleCommentSidebar = () =>
    setShowCommentSidebar((prev) => !prev);

  // ✅ Gửi bình luận
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

  // ✅ Chia sẻ link sản phẩm
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
      {/* ✅ Nhóm 3 nút hành động */}
      <div className="flex items-center justify-center gap-2 mt-auto w-full text-gray-700 text-sm relative">
        {/* ❤️ Nút thả tim */}
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

        {/* 💬 Nút mở tab bình luận */}
        <button
          onClick={handleToggleCommentSidebar}
          className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-gray-100 shadow-sm text-gray-600 hover:bg-pink-100 hover:text-pink-600 min-w-[60px]"
        >
          <MessageSquare size={16} />
          <span className="text-xs font-semibold">{comments.length}</span>
        </button>

        {/* 🔗 Nút chia sẻ */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-gray-100 shadow-sm text-gray-600 hover:bg-pink-100 hover:text-pink-600 min-w-[60px]"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* 🧩 Sidebar bình luận */}
      {showCommentSidebar && (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-white border-l border-gray-200 shadow-lg z-[9999] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Bình luận</h2>
            <button
              onClick={handleToggleCommentSidebar}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Danh sách bình luận */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                Chưa có bình luận nào.
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-3 items-start">
                  <img
                    src={c.user.avatar_url || "/default-avatar.png"}
                    alt={c.user.username}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div className="bg-gray-100 p-2 rounded-md text-sm flex-1">
                    <span className="font-semibold text-gray-700 block">
                      {c.user.username}
                    </span>
                    <span>{c.content}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Ô nhập bình luận */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button
              onClick={handleSendComment}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm font-medium"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
