// components/LongCard/index.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Heart as HeartIcon,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import useProductActions from "@/components/LongCard/hooks/useProductActions";
import type { LongCardProps } from "@/components/LongCard/types/long-card";

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

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const isOwner = currentUserId === product.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-1 py-1 bg-white transition hover:bg-gray-50 relative"
    >
      <div className="flex items-center gap-4 min-h-[200px]">
        <Link
          href={`/PageDetail/${product.id}`}
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
          <div className="flex items-center justify-between gap-3">
            <Link href={`/PageDetail/${product.id}`} className="min-w-0">
              <div className="text-lg font-semibold text-gray-800 leading-snug truncate">
                {product.title}
              </div>
            </Link>

            {isOwner && (
              <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                {product.views ?? 0} lượt xem
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-4 flex-wrap text-sm">
            {product.price != null && (
              <div className="text-base font-bold text-indigo-600 whitespace-nowrap">
                {product.price.toLocaleString()}₫
              </div>
            )}

            {product.communityName && (
              <Link
                href={`/communities/${product.community_id ?? ""}`}
                className="hover:opacity-80 whitespace-nowrap"
              >
                <span className="text-gray-500 mr-1">Từ</span>
                <span className="!text-gray-900">
                  {product.communityName}
                </span>
              </Link>
            )}

            <Link
              href={`/profile/${product.user_id ?? ""}`}
              className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
            >
              <span className="text-gray-500 text-sm">được đăng bởi</span>
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

          {/* TAGS – GIỐNG Y HỆT SmallCardTags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-1 flex items-center gap-1 flex-wrap">
              {product.tags.slice(0, 4).map((t, i) => (
                <div
                  key={i}
                  onClick={() => onTagClick?.(t)}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-300 whitespace-nowrap cursor-pointer"
                >
                  {t}
                </div>
              ))}
              {product.tags.length > 4 && (
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  +{product.tags.length - 4}
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => toggleLike(liked)}
              disabled={processing}
              className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition cursor-pointer"
            >
              <HeartIcon size={20} fill={liked ? "currentColor" : "none"} />
              <span className="text-sm">{localLikes}</span>
            </button>

            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle size={20} />
              <span className="text-sm">{commentsCount}</span>
            </div>

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

          <div className="mt-2 text-sm text-gray-500 flex items-center gap-3 flex-wrap">
            {product.category && (
              <span className="whitespace-nowrap">{product.category}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
