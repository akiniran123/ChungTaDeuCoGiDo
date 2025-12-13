// components/Trang_chu/pc/SmallCard.tsx
"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

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
  const [localLikes, setLocalLikes] = useState(likesCount);

  const toggleSave = (id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleLike = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user?.id) return alert("Bạn cần đăng nhập");

    const alreadyLiked = likedIds.includes(product.id);

    if (alreadyLiked) {
      await supabase.from("product_likes").delete().eq("product_id", product.id).eq("user_id", auth.user.id);
      setLikedIds((prev) => prev.filter((x) => x !== product.id));
      setLocalLikes((prev) => Math.max(prev - 1, 0));
    } else {
      await supabase.from("product_likes").insert({ product_id: product.id, user_id: auth.user.id });
      setLikedIds((prev) => [...prev, product.id]);
      setLocalLikes((prev) => prev + 1);
    }
  };

  const share = () => {
    const url = `${window.location.origin}/deal/${product.id}`;
    const title = product.title;
    if (navigator.share) navigator.share({ title, url });
    else alert(`Copy liên kết để chia sẻ: ${url}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full px-1 py-1 bg-white transition hover:bg-gray-50">
      <div className="flex items-center gap-4 min-h-[200px]">
        <SmallCardImage id={product.id} title={product.title} image_url={product.image_url} />

        <SmallCardMain product={product} commentsCount={commentsCount} />

        <SmallCardTags
          tags={product.tags}
          communityId={product.community_id}
          communityName={product.communityName}
          communityIcon={product.communityIcon}
          onTagClick={onTagClick}
        />

        <SmallCardActions
          productId={product.id}
          likedIds={likedIds}
          localLikes={localLikes}
          onToggleLike={toggleLike}
          onToggleSave={toggleSave}
          onShare={share}
        />
      </div>
    </motion.div>
  );
}