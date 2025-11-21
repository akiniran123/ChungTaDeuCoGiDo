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

      {/* AUTHOR SECTION */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={author?.avatar_url || "/default-avatar.png"}
          alt={author?.username || "User Avatar"}
          className="w-12 h-12 rounded-full border object-cover shadow"
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

      {/* PRODUCT TITLE */}
      <h1 className="text-3xl font-bold mb-6 leading-snug">
        {product.title}
      </h1>

      {/* MAIN IMAGE */}
      {product.image_url && (
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={product.image_url}
          alt={product.title}
          className="w-full max-h-[460px] object-cover rounded-xl shadow-lg mb-6"
        />
      )}

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between mt-3 text-gray-700 select-none">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">

          {/* LIKE BUTTON */}
          <motion.button
            onClick={onLike}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 cursor-pointer px-1 hover:text-pink-600 transition"
          >
            <HeartIcon
              size={22}
              fill={liked ? "currentColor" : "none"}
              className={liked ? "text-pink-600" : ""}
            />
            <span className="text-sm">{likesCount}</span>
          </motion.button>

          {/* COMMENT BUTTON */}
          <button
            onClick={onComment}
            className="flex items-center gap-1 cursor-pointer px-1 hover:text-gray-900 transition"
          >
            <MessageSquare size={22} />
            <span className="text-sm">{commentCount}</span>
          </button>

          {/* SHARE BUTTON */}
          <button
            onClick={onShare}
            className="flex items-center gap-1 cursor-pointer px-1 hover:text-gray-900 transition"
          >
            <Share2 size={22} />
            <span className="text-sm hidden sm:inline">Chia sẻ</span>
          </button>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={onSave}
          className={`cursor-pointer px-1 transition 
            ${saved ? "text-pink-600" : "text-gray-700 hover:text-gray-900"}`}
        >
          <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
        </button>

      </div>
    </div>
  );
}
