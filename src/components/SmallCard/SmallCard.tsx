"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

import SmallCardImage from "./SmallImage";
import SmallCardMain from "./SmallMain";
import SmallCardActions from "./SmallActions";

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
    user_id?: string | null;
  };
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onToggleLike?: () => void;
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
  onTagClick?: (tag: string) => void;
};

export default function SmallCard({
  product,
  likesCount,
  commentsCount,
  liked,
  onToggleLike,
  onToggleSave,
  onShare,
  onTagClick,
}: SmallCardProps) {
  const [saved, setSaved] = useState<string[]>([]);
  const [localLikes, setLocalLikes] = useState<number>(likesCount);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLocalLikes(likesCount);
  }, [likesCount]);

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    onToggleSave?.(id);
  };

  const toggleLike = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user?.id) {
        alert("Bạn cần đăng nhập");
        return;
      }

      if (liked) {
        await supabase
          .from("product_likes")
          .delete()
          .eq("product_id", product.id)
          .eq("user_id", auth.user.id);

        setLocalLikes((prev) => Math.max(prev - 1, 0));
      } else {
        await supabase.from("product_likes").insert({
          product_id: product.id,
          user_id: auth.user.id,
        });

        setLocalLikes((prev) => prev + 1);
      }

      onToggleLike?.();
    } catch (err) {
      console.error("toggleLike error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const share = () => {
    const url = `${window.location.origin}/deal/${product.id}`;
    const title = product.title;
    if (navigator.share) navigator.share({ title, url });
    else {
      onShare?.();
      alert(`Copy liên kết để chia sẻ: ${url}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm rounded-2xl bg-white shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* IMAGE + TAG OVERLAY + VIEWS */}
      <div className="relative">
        <SmallCardImage
          id={product.id}
          title={product.title}
          image_url={product.image_url}
        />

        {/* Lượt xem góc trên cùng phải */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-20">
          {product.views ?? 0} lượt xem
        </div>

        {/* TAGS */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 z-30 flex gap-1 flex-wrap">
            {product.tags.slice(0, 3).map((t, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(t);
                }}
                className="text-xs bg-black/70 text-white px-2 py-1 rounded-full backdrop-blur hover:bg-black/80 cursor-pointer whitespace-nowrap"
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <SmallCardMain
          product={product}
          communityId={product.community_id}
          communityName={product.communityName}
        />

        <SmallCardActions
          productId={product.id}
          liked={liked}
          localLikes={localLikes}
          commentsCount={commentsCount}
          onToggleLike={toggleLike}
          onToggleSave={() => toggleSave(product.id)}
          onShare={share}
        />
      </div>
    </motion.div>
  );
}
