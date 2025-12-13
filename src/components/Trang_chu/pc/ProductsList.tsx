"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid } from "lucide-react";
import SmallCard from "@/components/Trang_chu/pc/SmallCard";
import type { Database } from "@/types/supabase";
import ProductCard from "@/components/Trang_chu/pc/ProductCard";

export type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    username: string | null;
    avatar_url: string | null;
    id?: string;
  } | null;
  tags?: string[];
  communityNames?: string[];
  communityName?: string | null;
  communityIcon?: string | null;
  mainTag?: string | null;
  community_id?: string | null;
  views?: number | null;
};

export type Badge = Database["public"]["Tables"]["badges"]["Row"];

export type ProductsListProps = {
  products: ProductWithUser[];
  likesCount: Record<string, number>;
  commentsCount: Record<string, number>;
  likedIds: string[];
  setLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  userBadges?: Record<string, Badge[]>;
};

export default function ProductsList({
  products,
  likesCount,
  commentsCount,
  likedIds,
  setLikedIds,
}: ProductsListProps) {
  const [biggerGrid, setBiggerGrid] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const scrollPosition = useRef(0);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const visibleProducts = activeTag
    ? products.filter((p) => p.tags?.includes(activeTag))
    : products;

  // Header show/hide with requestAnimationFrame to avoid jank
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setShowHeader(false);
          } else {
            setShowHeader(true);
          }

          lastScrollY.current = currentScrollY;
          scrollPosition.current = currentScrollY;

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll position when toggling grid to avoid jump
  useEffect(() => {
    window.scrollTo({ top: scrollPosition.current, behavior: "auto" });
  }, [biggerGrid]);

  const toggleGrid = () => {
    scrollPosition.current = window.scrollY;
    setBiggerGrid((prev) => !prev);
  };

  return (
    <div className="px-6 pb-6">
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-30 bg-white"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Removed categories and SearchBar per request */}
            <div className="pb-2 flex items-center gap-2 px-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                <span>Best</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                onClick={toggleGrid}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                  biggerGrid
                    ? "bg-pink-100 text-pink-600 border-pink-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {biggerGrid ? <Grid size={16} /> : <LayoutGrid size={16} />}
                Chế độ xem
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTag && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm cursor-pointer select-none">
            Đang lọc theo tag:
            <strong className="ml-1 text-pink-600">#{activeTag}</strong>
          </span>
          <button
            onClick={() => setActiveTag(null)}
            className="cursor-pointer px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
          >
            Hủy lọc
          </button>
        </div>
      )}

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
          {visibleProducts.map((p) =>
            biggerGrid ? (
              <ProductCard
                key={p.id}
                p={{
                  ...p,
                  users: p.users
                    ? {
                        username: p.users.username,
                        avatar_url: p.users.avatar_url,
                        id: p.users.id,
                      }
                    : null,
                  image_url: p.image_url ?? null,
                  tags: p.tags ?? [],
                  communityNames: p.communityNames ?? [],
                  communityName: p.communityName ?? null,
                  communityIcon: p.communityIcon ?? null,
                  community_id: p.community_id ?? null,
                  mainTag: p.mainTag ?? null,
                  views: p.views ?? 0,
                }}
                saved={likedIds}
                toggleSave={() => {
                  if (likedIds.includes(p.id)) {
                    setLikedIds((prev) => prev.filter((id) => id !== p.id));
                  } else {
                    setLikedIds((prev) => [...prev, p.id]);
                  }
                }}
                likedIds={likedIds}
                toggleLike={() => {
                  if (likedIds.includes(p.id)) {
                    setLikedIds((prev) => prev.filter((id) => id !== p.id));
                  } else {
                    setLikedIds((prev) => [...prev, p.id]);
                  }
                }}
                localLikesCount={likesCount}
                commentsCount={commentsCount}
                setActiveTag={setActiveTag}
                shareProduct={() => {
                  navigator.share?.({
                    title: p.title ?? undefined,
                    url: `/deal/${p.id}`,
                  });
                }}
              />
            ) : (
              <SmallCard
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
    </div>
  );
}