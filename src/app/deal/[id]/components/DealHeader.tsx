"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Share2,
  Bookmark,
  Heart as HeartIcon,
} from "lucide-react";

import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function DealHeader({
  product,
  author,

  liked = false,
  likesCount = 0,
  commentCount = 0,
  saved = false,

  onLike,
  onComment,
  onShare,
  onSave,
}: {
  product: Product;
  author: User | null;

  liked?: boolean;
  likesCount?: number;
  commentCount?: number;
  saved?: boolean;

  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}) {
  return (
    <div className="p-6">

      {/* USER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={author?.avatar_url || "/default-avatar.png"}
          alt={author?.username || "User Avatar"}
          className="w-12 h-12 rounded-full border object-cover"
        />

        <div>
          <p className="font-semibold text-lg">
            {author?.username || "Người dùng"}
          </p>
          <p className="text-gray-500 text-sm">
            Đăng vào:{" "}
            {product.created_at
              ? new Date(product.created_at).toLocaleString()
              : "Không rõ thời gian"}
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

      {/* IMAGE */}
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full max-h-[460px] object-cover rounded-xl shadow mb-4"
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between gap-3 mt-3 text-sm text-gray-700 mb-3">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* Like */}
          <motion.div
            className={`flex items-center rounded-full px-2 py-1 shadow-sm transition-all relative ${
              liked ? "bg-pink-50" : "bg-gray-100"
            }`}
          >
            {liked && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(255,192,203,0.4)",
                  filter: "blur(6px)",
                  zIndex: 0,
                }}
              />
            )}

            <motion.button
              onClick={onLike}
              whileTap={{ scale: 0.9 }}
              className={`relative p-1 transition-transform duration-200 z-10 ${
                liked
                  ? "text-pink-600 scale-110"
                  : "text-gray-600 hover:text-pink-600"
              }`}
            >
              <HeartIcon size={18} fill={liked ? "currentColor" : "none"} />
            </motion.button>

            <span className="font-semibold text-xs min-w-[20px] relative z-10">
              {likesCount}
            </span>
          </motion.div>

          {/* Comment */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <button
              onClick={onComment}
              className="hover:text-pink-600 p-1 cursor-pointer"
            >
              <MessageSquare size={18} />
            </button>
            <span className="font-semibold text-xs min-w-[20px]">
              {commentCount}
            </span>
          </div>

          {/* Share */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm border border-gray-200 hover:border-pink-300 transition">
            <button
              onClick={onShare}
              className="hover:text-pink-600 p-1 cursor-pointer flex items-center gap-1"
            >
              <Share2 size={18} />
              <span className="text-xs hidden sm:inline">Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={onSave}
            className={`hover:text-pink-600 p-1 cursor-pointer ${
              saved ? "text-pink-600" : "text-gray-700"
            }`}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

      </div>
    </div>
  );
}
