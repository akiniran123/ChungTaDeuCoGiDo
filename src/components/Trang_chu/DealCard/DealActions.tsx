"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Share2,
  Bookmark,
  Heart as HeartIcon,
} from "lucide-react";

interface DealActionsProps {
  liked: boolean;
  likesCount: number;
  commentCount: number;
  saved: boolean;
  handleLike: () => void;
  handleSave: () => void;
  toggleChat: () => void;
  deal: any;
}

const DealActions: React.FC<DealActionsProps> = ({
  liked,
  likesCount,
  commentCount,
  saved,
  handleLike,
  handleSave,
  toggleChat,
  deal,
}) => {
  const handleShare = () => {
    if (!deal?.id) return alert("Không tìm thấy sản phẩm để chia sẻ!");

    const url = `${window.location.origin}/#deal-${deal.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: deal?.title || "Chia sẻ sản phẩm",
          url,
        })
        .catch((err) => console.log("Lỗi khi chia sẻ:", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("📎 Đã sao chép liên kết: " + url);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-3 text-sm text-gray-700 pl-3 mb-3">
      {/* Các nút bên trái */}
      <div className="flex items-center gap-3">
        {/* ❤️ Like */}
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
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`relative p-1 transition-transform duration-200 z-10 ${
              liked ? "text-pink-600 scale-110" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            <HeartIcon
              size={18}
              fill={liked ? "currentColor" : "none"}
              className="relative"
            />
          </motion.button>
          <span className="font-semibold text-xs text-center min-w-[20px] relative z-10">
            {likesCount}
          </span>
        </motion.div>

        {/* 💬 Comment */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={toggleChat}
            className="hover:text-pink-600 p-1 cursor-pointer"
          >
            <MessageSquare size={18} />
          </button>
          <span className="font-semibold text-xs text-center min-w-[20px]">
            {commentCount}
          </span>
        </div>

        {/* 🔗 Share */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm border border-gray-200 hover:border-pink-300 transition">
          <button
            onClick={handleShare}
            className="hover:text-pink-600 p-1 cursor-pointer text-gray-700 flex items-center gap-1"
          >
            <Share2 size={18} className="text-gray-700" />
            <span className="text-xs hidden sm:inline">Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* 🔖 Save (Bookmark) */}
      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm mr-3">
        <button
          onClick={handleSave}
          className={`hover:text-pink-600 p-1 cursor-pointer ${
            saved ? "text-pink-600" : "text-gray-700"
          }`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

export default DealActions;
