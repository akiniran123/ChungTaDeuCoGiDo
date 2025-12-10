// ProductCard.tsx — Component thẻ nhỏ (đầy đủ, sạch, đúng props)

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Heart as HeartIcon, Share2 } from "lucide-react";
import type { Database } from "@/types/supabase";

// ======================
// Type
// ======================
export type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    username: string | null;
    avatar_url: string | null;
    id?: string;
  } | null;

  tags?: string[];
  communityNames?: string[];

  communityName?: string | null;
  communityIcon?: string | null;
  mainTag?: string | null;
};

interface ProductCardProps {
  p: ProductWithUser;
  saved: string[];
  toggleSave: (id: string) => void;

  likedIds: string[];
  toggleLike: (id: string) => void;

  localLikesCount: Record<string, number>;
  commentsCount: Record<string, number>;

  setActiveTag: (tag: string) => void;
  shareProduct: (product: ProductWithUser) => void;
}

export default function ProductCard({
  p,
  saved,
  toggleSave,
  likedIds,
  toggleLike,
  localLikesCount,
  commentsCount,
  setActiveTag,
  shareProduct,
}: ProductCardProps) {
  return (
    <motion.div
      key={p.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
    >
      {/* Image */}
      <Link href={`/deal/${p.id}`}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.title}
            className="w-full h-48 object-cover cursor-pointer"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer">
            Không có ảnh
          </div>
        )}
      </Link>

      {/* USER / TIME */}
      {p.users && (
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center gap-2">
            <img
              src={p.users.avatar_url || "/default-avatar.png"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {p.users.username}
              </span>
              <span className="text-xs text-gray-500">
                {p.created_at
                  ? new Date(p.created_at).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Không rõ thời gian"}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleSave(p.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
          >
            {saved.includes(p.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      )}

      {/* TITLE */}
      <div className="px-4 mt-2">
        <Link href={`/deal/${p.id}`}>
          <h3 className="font-semibold text-lg cursor-pointer hover:text-pink-500">
            {p.title}
          </h3>
        </Link>
      </div>

      {/* CATEGORY / PRICE / TAGS */}
      <div className="p-4 pt-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-600">{p.category}</p>

            <p className="mt-2 text-indigo-600 font-bold">
              {p.price ? `${p.price.toLocaleString()}₫` : "Liên hệ"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {commentsCount[p.id] ?? 0} bình luận
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4 w-32">
            {(p.tags?.length || p.communityNames?.length) && (
              <div className="flex flex-wrap justify-end gap-2 max-w-32">
                {/* CLICK TAG → FILTER */}
                {p.tags?.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTag(tag)}
                    className="text-xs bg-pink-50 text-purple-500 px-2 py-1 rounded-full hover:bg-pink-100 transition"
                  >
                    {tag}
                  </button>
                ))}

                {p.communityNames?.map((cName, i) => (
                  <span
                    key={`c-${i}`}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                  >
                    {cName}
                  </span>
                ))}
              </div>
            )}

            {/* COMMUNITY */}
            {p.communityName && (
              <Link
                href={`/communities/${p.community_id}`}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {p.communityIcon && (
                  <img src={p.communityIcon} className="w-6 h-6 rounded-full" />
                )}
                <span className="text-sm text-gray-600 font-semibold hover:text-pink-600">
                  {p.communityName}
                </span>
              </Link>
            )}

            {p.mainTag && (
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                #{p.mainTag}
              </span>
            )}
          </div>
        </div>

        {/* LIKE / SHARE */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">{p.views ?? 0} lượt xem</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleLike(p.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
            >
              <HeartIcon
                size={16}
                fill={likedIds.includes(p.id) ? "currentColor" : "none"}
              />
              <span className="text-xs font-semibold">
                {localLikesCount[p.id] ?? 0}
              </span>
            </button>

            <button
              onClick={() => shareProduct(p)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
