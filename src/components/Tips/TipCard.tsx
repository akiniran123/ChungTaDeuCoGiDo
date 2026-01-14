"use client";

import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// 1. Định nghĩa Interface để thay thế 'any'
export interface CommunityTip {
  id: string;
  title: string;
  content: string;
  category: string;
  username: string;
  upvotes: number;
  user_id?: string | null;
  created_at?: string;
}

interface TipCardProps {
  tip: CommunityTip;
}

export const TipCard = ({ tip }: TipCardProps) => {
  // Định nghĩa kiểu dữ liệu rõ ràng cho các state
  const [upvotes, setUpvotes] = useState<number>(tip.upvotes || 0);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleUpvote = async (): Promise<void> => {
    if (isSyncing) return;

    // --- Bước 1: Optimistic UI (Cập nhật giao diện trước) ---
    setUpvotes((prev: number) => prev + 1);
    setIsAnimate(true);
    setIsSyncing(true);

    // Hiệu ứng animation bounce trong 300ms
    setTimeout(() => setIsAnimate(false), 300);

    // --- Bước 2: Cập nhật Database qua RPC ---
    try {
      const { error } = await supabase.rpc("increment_upvote", {
        tip_id: tip.id,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Lỗi khi upvote:", err);
      // Hoàn tác (Rollback) số lượng nếu API thất bại
      setUpvotes((prev: number) => prev - 1);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
      {/* Category Tag */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
          {tip.category || "Chung"}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {tip.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {tip.content}
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
            Contributed by
          </span>
          <span className="text-[11px] font-bold text-slate-700 uppercase">
            {tip.username?.split(" ").pop() || "Anonymous"}
          </span>
        </div>

        <button
          onClick={handleUpvote}
          disabled={isSyncing}
          title="Upvote this tip"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 ${
            isAnimate
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          } ${isSyncing ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
        >
          <ThumbsUp
            className={`w-4 h-4 transition-transform ${
              isAnimate ? "animate-bounce" : ""
            }`}
          />
          <span className="text-sm font-black tabular-nums">{upvotes}</span>
        </button>
      </div>
    </div>
  );
};