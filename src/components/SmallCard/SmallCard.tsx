"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

import SmallCardImage from "./SmallImage";
import SmallCardMain from "./SmallMain";
import SmallCardTags from "./SmallTags";
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
      {/* IMAGE */}
      <SmallCardImage
        id={product.id}
        title={product.title}
        image_url={product.image_url}
      />

      {/* BODY */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* ✅ TÊN CỘNG ĐỒNG (SmallCardTags) LÊN TRÊN CÙNG */}
        <SmallCardTags
          tags={product.tags}
          communityId={product.community_id}
          communityName={product.communityName}
          onTagClick={(t) => onTagClick?.(t)}
        />

        <SmallCardMain
          product={product}
          commentsCount={commentsCount}
        />

        <SmallCardActions
          productId={product.id}
          liked={liked}
          localLikes={localLikes}
          onToggleLike={toggleLike}
          onToggleSave={() => toggleSave(product.id)}
          onShare={share}
        />
      </div>
    </motion.div>
  );
}
