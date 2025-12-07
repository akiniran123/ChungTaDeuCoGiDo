"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Heart as HeartIcon,
  Share2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export type SmallCardProps = {
  product: {
    id: string;
    title: string;
    image_url?: string | null;
    tags?: string[];
    author?: string | null;
    avatar_url?: string | null;
    created_at?: string | null;
    category?: string | null;
    price?: number | null;
    views?: number | null;
    community_id?: string | null;
    communityName?: string | null;
    communityIcon?: string | null;
    user_id: string;
  };
  likesCount: number;
  commentsCount: number;
  likedIds: string[];
  setLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onTagClick: (tag: string) => void;
};

export default function SmallCard({
  product,
  likesCount,
  commentsCount,
  likedIds,
  setLikedIds,
  onTagClick,
}: SmallCardProps) {
  const [saved, setSaved] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleLike = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user?.id) return alert("Bạn cần đăng nhập");

    const alreadyLiked = likedIds.includes(product.id);

    if (alreadyLiked) {
      await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", auth.user.id);

      setLikedIds((prev) => prev.filter((x) => x !== product.id));
    } else {
      await supabase.from("product_likes").insert({
        product_id: product.id,
        user_id: auth.user.id,
      });
      setLikedIds((prev) => [...prev, product.id]);
    }
  };

  const share = () => {
    const url = `${window.location.origin}/deal/${product.id}`;
    const title = product.title;

    if (navigator.share) navigator.share({ title, url });
    else alert(`Copy liên kết để chia sẻ: ${url}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full px-4 py-3 bg-white
        transition 
        hover:bg-gray-50
      "
    >
      {/* ROW */}
      <div className="flex items-center gap-4 min-h-[135px]">
        {/* IMAGE */}
        <Link
          href={`/deal/${product.id}`}
          className="flex-shrink-0 overflow-hidden w-[150px] h-[110px] bg-gray-100 rounded-lg"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Không có ảnh
            </div>
          )}
        </Link>

        {/* MAIN */}
        <div className="flex-1 min-w-0">

          {/* 🔥 USER + TIME — ĐƯA LÊN HÀNG ĐẦU */}
          <div className="mb-1 text-sm flex items-center gap-3 flex-wrap">
            <Link
              href={`/profile/${product.user_id}`}
              className="flex items-center gap-2 whitespace-nowrap hover:opacity-80 cursor-pointer"
            >
              <img
                src={product.avatar_url || "/default-avatar.png"}
                className="w-6 h-6 rounded-full object-cover"
                alt="avatar"
              />
              <span className="truncate max-w-[150px] text-gray-900">
                {product.author || "Người dùng"}
              </span>
            </Link>

            <span className="whitespace-nowrap text-gray-400 text-xs">
              {product.created_at
                ? new Date(product.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>

          {/* TITLE + PRICE */}
          <div className="flex items-center gap-3">
            <Link href={`/deal/${product.id}`} className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-gray-800 leading-snug truncate">
                {product.title}
              </div>
            </Link>

            {product.price && (
              <div className="ml-2 text-base font-bold text-indigo-600 whitespace-nowrap">
                {product.price.toLocaleString()}₫
              </div>
            )}
          </div>

          {/* META giữ nguyên 100% */}
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-3 flex-wrap">
            {product.category && (
              <span className="whitespace-nowrap">{product.category}</span>
            )}

            <span className="whitespace-nowrap">
              {commentsCount} bình luận
            </span>

            {product.communityName && (
              <Link
                href={`/communities/${product.community_id}`}
                className="flex items-center gap-2 hover:opacity-80 whitespace-nowrap cursor-pointer"
              >
                {product.communityIcon && (
                  <img
                    src={product.communityIcon}
                    className="w-6 h-6 rounded-full object-cover"
                    alt="community"
                  />
                )}
                <span className="truncate max-w-[140px] text-gray-900">
                  {product.communityName}
                </span>
              </Link>
            )}

            <span className="whitespace-nowrap">
              {product.views ?? 0} lượt xem
            </span>
          </div>
        </div>

        {/* TAGS */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex-shrink-0 hidden lg:flex items-center gap-1 ml-2">
            {product.tags.slice(0, 4).map((t, i) => (
              <button
                key={i}
                onClick={() => onTagClick(t)}
                className="text-xs bg-pink-50 text-purple-500 px-2 py-1 rounded-full hover:bg-pink-100 whitespace-nowrap cursor-pointer"
              >
                {t}
              </button>
            ))}

            {product.tags.length > 4 && (
              <div className="text-xs text-gray-400 whitespace-nowrap">
                +{product.tags.length - 4}
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
          >
            <HeartIcon
              size={20}
              fill={likedIds.includes(product.id) ? "currentColor" : "none"}
            />
            <span className="text-sm">{likesCount}</span>
          </button>

          <button
            onClick={share}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => toggleSave(product.id)}
            className="text-gray-600 hover:text-pink-500 transition"
          >
            {saved.includes(product.id) ? (
              <BookmarkCheck size={20} />
            ) : (
              <Bookmark size={20} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
