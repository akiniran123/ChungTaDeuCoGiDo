// components/LongCard/index.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Heart as HeartIcon, Share2 } from "lucide-react";
import useProductActions from "@/components/LongCard/hooks/useProductActions";
import type { LongCardProps } from "@/components/LongCard/types/long-card";

// Hàm tính thời gian tương đối bằng tiếng Việt
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} ngày trước`;
  if (diffHour > 0) return `${diffHour} giờ trước`;
  if (diffMin > 0) return `${diffMin} phút trước`;
  return "Vừa xong";
}

export default function LongCard({
  product,
  likesCount,
  commentsCount,
  liked,
  onToggleLike,
  onToggleSave,
  onShare,
  onTagClick,
}: LongCardProps) {
  const { saved, localLikes, processing, toggleSave, toggleLike, share } =
    useProductActions({
      productId: product.id,
      initialLikes: likesCount,
      initialLiked: liked,
      onToggleLike,
      onToggleSave,
      onShare,
    });

  const isSaved = saved.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-1 py-1 bg-white transition hover:bg-gray-50 relative"
    >
      <div className="flex items-center gap-4 min-h-[200px]">
        <Link
          href={`/deal/${product.id}`}
          className="flex-shrink-0 overflow-hidden w-[195px] h-[195px] bg-gray-100 rounded-lg relative"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="195px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Không có ảnh
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="mb-1 text-sm flex items-center gap-3 flex-wrap">
            <Link
              href={`/profile/${product.user_id ?? ""}`}
              className="flex items-center gap-2 whitespace-nowrap hover:opacity-80 cursor-pointer"
            >
              <Image
                src={product.avatar_url || "/default-avatar.png"}
                alt="avatar"
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              <span className="truncate max-w-[150px] text-gray-900">
                {product.author || "Người dùng"}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/deal/${product.id}`} className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-gray-800 leading-snug truncate">
                {product.title}
              </div>
            </Link>

            {product.price != null && (
              <div className="ml-2 text-base font-bold text-indigo-600 whitespace-nowrap">
                {product.price.toLocaleString()}₫
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-500 flex items-center gap-3 flex-wrap">
            {product.category && (
              <span className="whitespace-nowrap">{product.category}</span>
            )}
            <span className="whitespace-nowrap">
              {commentsCount} bình luận
            </span>
            <span className="whitespace-nowrap">
              {product.views ?? 0} lượt xem
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 hidden lg:flex flex-col gap-1 ml-2">
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {product.tags.slice(0, 4).map((t, i) => (
                <button
                  key={i}
                  onClick={() => onTagClick?.(t)}
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

          {/* ✅ ĐÃ BỎ AVATAR CỘNG ĐỒNG – chỉ giữ tên + link */}
          {product.communityName && (
            <Link
              href={`/communities/${product.community_id ?? ""}`}
              className="hover:opacity-80 whitespace-nowrap cursor-pointer mt-1"
            >
              <span className="truncate max-w-[140px] text-gray-900">
                {product.communityName}
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
          <button
            onClick={() => toggleLike(liked)}
            disabled={processing}
            className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition cursor-pointer"
          >
            <HeartIcon size={20} fill={liked ? "currentColor" : "none"} />
            <span className="text-sm">{localLikes}</span>
          </button>

          <button
            onClick={() => share(product.title)}
            className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => toggleSave(product.id)}
            className="text-gray-600 hover:text-pink-500 transition cursor-pointer"
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>
      </div>

      {product.created_at && (
        <div className="absolute top-2 right-2 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
          {getRelativeTime(product.created_at)}
        </div>
      )}
    </motion.div>
  );
}
