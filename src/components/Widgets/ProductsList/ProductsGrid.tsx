"use client";

import { AnimatePresence, motion } from "framer-motion";
import SmallCard from "@/components/Widgets/SmallCard/SmallCard";
import LongCard from "@/components/Widgets/LongCard/LongCard";
import type { ProductListItem } from "@/types/products";

type Props = {
  products: ProductListItem[];
  biggerGrid: boolean;
  likesCount: Record<string, number>;
  commentsCount: Record<string, number>;
  likedIds: string[];
  /** Accept the full setState dispatch so children can use updater functions too */
  setLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTag: (tag: string | null) => void;
};

export default function ProductsGrid({
  products,
  biggerGrid,
  likesCount,
  commentsCount,
  likedIds,
  setLikedIds,
  setActiveTag,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={biggerGrid ? "large" : "small"}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        className={`grid gap-4 ${biggerGrid ? "grid-cols-4" : "grid-cols-1"}`}
      >
        {products.map((p) => {
          const id = p.id;

          // per-product counts (lookup from maps)
          const likesForProduct = likesCount[id] ?? 0;
          const commentsForProduct = commentsCount[id] ?? 0;
          const isLiked = likedIds.includes(id);

          return biggerGrid ? (
            <SmallCard
              key={id}
              product={{
                id,
                title: p.title,
                image_url: p.image_url ?? null,
                tags: p.tags ?? [],
                author: p.users.username,
                avatar_url: p.users.avatar_url ?? null,
                created_at: p.created_at ?? null,
                category: p.category,
                price: p.price,
                views: p.views,
                community_id: p.community_id,
                communityName: p.communityName,
                communityIcon: p.communityIcon ?? null,
                user_id: p.user_id,
              }}
              /** pass per-product numbers */
              likesCount={likesForProduct}
              commentsCount={commentsForProduct}
              liked={isLiked}
              setLikedIds={setLikedIds}
              onTagClick={(tag) => setActiveTag(tag)}
            />
          ) : (
            <LongCard
              key={id}
              product={{
                id,
                title: p.title,
                image_url: p.image_url ?? null,
                tags: p.tags ?? [],
                author: p.users.username,
                avatar_url: p.users.avatar_url ?? null,
                created_at: p.created_at ?? null,
                category: p.category,
                price: p.price,
                views: p.views,
                community_id: p.community_id,
                communityName: p.communityName,
                communityIcon: p.communityIcon ?? null,
                user_id: p.user_id,
              }}
              likesCount={likesForProduct}
              commentsCount={commentsForProduct}
              liked={isLiked}
              setLikedIds={setLikedIds}
              onTagClick={(tag) => setActiveTag(tag)}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}