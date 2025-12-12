"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Share2,
  Bookmark,
  Heart as HeartIcon,
} from "lucide-react";

type Deal = {
  id: string | number;
  title?: string | null;
} & Record<string, unknown>;

interface DealActionsProps {
  liked: boolean;
  likesCount: number;
  commentCount: number;
  saved: boolean;
  handleLike: () => void;
  handleSave: () => void;
  toggleChat: () => void;
  deal: Deal;
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

    const url = `${window.location.origin}/#deal-${String(deal.id)}`;

    if (navigator.share) {
      navigator
        .share({
          title: (deal?.title as string) || "Chia sẻ sản phẩm",
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
      {/* ===== LEFT ACTIONS ===== */}
      <div className="flex items-center gap-4">
        {/* ❤️ LIKE */}
        <motion.div className="flex items-center gap-1 relative">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`p-1 transition-all duration-200 ${
              liked ? "text-pink-600 scale-110" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            <HeartIcon size={20} fill={liked ? "currentColor" : "none"} />
          </motion.button>

          <span className="font-semibold text-xs min-w-[20px] text-gray-700">
            {likesCount}
          </span>
        </motion.div>

        {/* 💬 COMMENT */}
        <div className="flex items-center gap-1">
          <button onClick={toggleChat} className="p-1 text-gray-700 hover:text-pink-600">
            <MessageSquare size={20} />
          </button>

          <span className="font-semibold text-xs min-w-[20px] text-gray-700">
            {commentCount}
          </span>
        </div>

        {/* 🔗 SHARE */}
        <button
          onClick={handleShare}
          className="p-1 text-gray-700 hover:text-pink-600 flex items-center gap-1"
        >
          <Share2 size={20} />
          <span className="text-xs hidden sm:inline">Chia sẻ</span>
        </button>
      </div>

      {/* ===== SAVE (BOOKMARK) ===== */}
      <button
        onClick={handleSave}
        className={`p-1 mr-3 ${
          saved ? "text-pink-600" : "text-gray-700 hover:text-pink-600"
        }`}
      >
        <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default DealActions;