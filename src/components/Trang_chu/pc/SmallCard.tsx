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
      className="w-full rounded-lg bg-white shadow-sm hover:shadow-md transition px-3 py-2"
    >
      {/* Single-row horizontal flow */}
      <div className="flex items-center gap-3 min-h-[86px]">
        {/* IMAGE (left) */}
        <Link
          href={`/deal/${product.id}`}
          className="flex-shrink-0 rounded-md overflow-hidden w-[92px] h-[72px] bg-gray-100"
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

        {/* MAIN INLINE CONTENT (center) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Title (truncate single line) */}
            <Link href={`/deal/${product.id}`} className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-800 truncate hover:text-pink-500">
                {product.title}
              </div>
            </Link>

            {/* Price (if any) */}
            {product.price && (
              <div className="ml-2 text-sm font-bold text-indigo-600 whitespace-nowrap">
                {product.price.toLocaleString()}₫
              </div>
            )}
          </div>

          {/* Inline meta row: category • author • community • comments • views */}
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-3 flex-wrap">
            {product.category && (
              <span className="whitespace-nowrap">{product.category}</span>
            )}

            <span className="flex items-center gap-1 whitespace-nowrap">
              <img
                src={product.avatar_url || "/default-avatar.png"}
                className="w-4 h-4 rounded-full object-cover"
                alt="avatar"
              />
              <span className="truncate max-w-[120px]">{product.author || "Người dùng"}</span>
            </span>

            <span className="whitespace-nowrap">{commentsCount} bình luận</span>

            {product.communityName && (
              <Link
                href={`/communities/${product.community_id}`}
                className="flex items-center gap-1 hover:opacity-80 whitespace-nowrap"
              >
                {product.communityIcon && (
                  <img
                    src={product.communityIcon}
                    className="w-4 h-4 rounded-full object-cover"
                    alt="community"
                  />
                )}
                <span className="truncate max-w-[100px]">{product.communityName}</span>
              </Link>
            )}

            <span className="whitespace-nowrap">{product.views ?? 0} lượt xem</span>
          </div>
        </div>

        {/* TAGS (inline, scroll if too many) */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex-shrink-0 hidden md:flex items-center gap-2 ml-2">
            {product.tags.slice(0, 4).map((t, i) => (
              <button
                key={i}
                onClick={() => onTagClick(t)}
                className="text-xs bg-pink-50 text-purple-500 px-2 py-0.5 rounded-full hover:bg-pink-100 whitespace-nowrap"
              >
                {t}
              </button>
            ))}
            {product.tags.length > 4 && (
              <div className="text-xs text-gray-400 whitespace-nowrap">+{product.tags.length - 4}</div>
            )}
          </div>
        )}

        {/* ACTIONS (right) */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {/* Like */}
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
            aria-label="like"
            title="Thích"
          >
            <HeartIcon
              size={16}
              fill={likedIds.includes(product.id) ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">{likesCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={share}
            className="text-gray-600 hover:text-gray-800 transition"
            aria-label="share"
            title="Chia sẻ"
          >
            <Share2 size={16} />
          </button>

          {/* Save */}
          <button
            onClick={() => toggleSave(product.id)}
            className="text-gray-600 hover:text-pink-500 transition"
            aria-label="save"
            title="Lưu"
          >
            {saved.includes(product.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
