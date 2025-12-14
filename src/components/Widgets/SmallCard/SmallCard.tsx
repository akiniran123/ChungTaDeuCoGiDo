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
  /** per-product counts (numbers) */
  likesCount: number;
  commentsCount: number;
  /** whether current user liked this product */
  liked: boolean;
  /** notify parent to toggle likedIds (parent keeps the map/state) */
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

  // keep localLikes in sync with parent-provided number
  useEffect(() => {
    setLocalLikes(likesCount);
  }, [likesCount]);

  const toggleSave = (id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
        // unlike in DB
        await supabase
          .from("product_likes")
          .delete()
          .eq("product_id", product.id)
          .eq("user_id", auth.user.id);

        setLocalLikes((prev) => Math.max(prev - 1, 0));
      } else {
        // like in DB
        await supabase.from("product_likes").insert({
          product_id: product.id,
          user_id: auth.user.id,
        });

        setLocalLikes((prev) => prev + 1);
      }

      // notify parent to update its likedIds state
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
      className="w-full px-1 py-1 bg-white transition hover:bg-gray-50"
    >
      <div className="flex items-center gap-4 min-h-[200px]">
        <SmallCardImage id={product.id} title={product.title} image_url={product.image_url} />

        {/* Pass numeric commentsCount for SmallCardMain */}
        <SmallCardMain product={product} commentsCount={commentsCount} />

        <SmallCardTags
          tags={product.tags}
          communityId={product.community_id}
          communityName={product.communityName}
          communityIcon={product.communityIcon}
          onTagClick={(t) => onTagClick?.(t)}
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