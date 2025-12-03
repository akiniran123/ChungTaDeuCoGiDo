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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
    >
      {/* IMAGE */}
      <Link href={`/deal/${product.id}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-48 object-cover cursor-pointer"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            Không có ảnh
          </div>
        )}
      </Link>

      {/* USER + TIME + SAVE */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2">
          <img
            src={product.avatar_url || "/default-avatar.png"}
            className="w-8 h-8 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">
              {product.author || "Người dùng"}
            </span>
            <span className="text-xs text-gray-500">
              {product.created_at
                ? new Date(product.created_at).toLocaleString("vi-VN", {
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
          onClick={() => toggleSave(product.id)}
          className="text-gray-600 hover:text-pink-500 transition"
        >
          {saved.includes(product.id) ? (
            <BookmarkCheck size={18} />
          ) : (
            <Bookmark size={18} />
          )}
        </button>
      </div>

      {/* TITLE */}
      <div className="px-4 mt-2">
        <Link href={`/deal/${product.id}`}>
          <h3 className="font-semibold text-lg cursor-pointer hover:text-pink-500">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* CATEGORY — PRICE — TAGS — COMMUNITY */}
      <div className="p-4 pt-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-600">{product.category}</p>

            {product.price && (
              <p className="mt-2 text-indigo-600 font-bold">
                {product.price.toLocaleString()}₫
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              {commentsCount} bình luận
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4 w-32">
            {/* TAGS */}
            {product.tags?.length ? (
              <div className="flex flex-wrap justify-end gap-2 max-w-32">
                {product.tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => onTagClick(tag)}
                    className="text-xs bg-pink-50 text-purple-500 px-2 py-1 rounded-full hover:bg-pink-100 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}

            {/* COMMUNITY */}
            {product.communityName && product.community_id && (
              <Link
                href={`/communities/${product.community_id}`}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {product.communityIcon && (
                  <img
                    src={product.communityIcon}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600 font-semibold hover:text-pink-600">
                  {product.communityName}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* LIKE — SHARE */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {product.views ?? 0} lượt xem
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
            >
              <HeartIcon
                size={16}
                fill={likedIds.includes(product.id) ? "currentColor" : "none"}
              />
              <span className="text-xs font-semibold">{likesCount}</span>
            </button>

            <button
              onClick={share}
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
