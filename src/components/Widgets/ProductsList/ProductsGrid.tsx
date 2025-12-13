// components/Trang_chu/pc/ProductsGrid.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import SmallCard from "@/components/Widgets/SmallCard/SmallCard";
import LongCard from "@/components/Widgets/LongCard/LongCard";
import type { ProductWithUser } from "@/types/products";

type Props = {
  products: ProductWithUser[];
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
        {products.map((p) =>
          biggerGrid ? (
            <SmallCard
              key={p.id}
              product={{
                id: p.id,
                title: p.title,
                image_url: p.image_url ?? null,
                tags: p.tags ?? [],
                author: p.users?.username ?? null,
                avatar_url: p.users?.avatar_url ?? null,
                created_at: p.created_at ?? null,
                category: p.category ?? null,
                price: p.price ?? null,
                views: p.views ?? null,
                community_id: p.community_id ?? null,
                communityName: p.communityName ?? null,
                communityIcon: p.communityIcon ?? null,
                user_id: p.users?.id ?? "",
              }}
              /** Pass the full mappings because SmallCard expects Record<string, number> */
              likesCount={likesCount}
              commentsCount={commentsCount}
              likedIds={likedIds}
              setLikedIds={setLikedIds}
              onTagClick={(tag) => setActiveTag(tag)}
            />
          ) : (
            <LongCard
              key={p.id}
              product={{
                id: p.id,
                title: p.title,
                image_url: p.image_url ?? undefined,
                tags: p.tags ?? [],
                author: p.users?.username ?? null,
                avatar_url: p.users?.avatar_url ?? null,
                created_at: p.created_at ?? null,
                category: p.category ?? null,
                price: p.price ?? null,
                views: p.views ?? null,
                community_id: p.community_id ?? null,
                communityName: p.communityName ?? null,
                communityIcon: p.communityIcon ?? null,
                user_id: p.users?.id ?? "",
              }}
              likesCount={likesCount[p.id] ?? 0}
              commentsCount={commentsCount[p.id] ?? 0}
              likedIds={likedIds}
              setLikedIds={setLikedIds}
              onTagClick={(tag) => setActiveTag(tag)}
            />
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
}