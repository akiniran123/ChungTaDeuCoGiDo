"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid } from "lucide-react";
import SmallCard from "@/components/Trang_chu/pc/SmallCard";
import DealCard from "@/components/Trang_chu/pc/DealCard";
import type { Database } from "@/types/supabase";
import SearchBar from "@/components/Navbar/pc/LogoSearchIcon/SearchBar"; // ✅ import SearchBar

type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
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
};

type Badge = Database["public"]["Tables"]["badges"]["Row"];

interface ProductsListProps {
  products: ProductWithUser[];
  likesCount: Record<string, number>;
  commentsCount: Record<string, number>;
  likedIds: string[];
  setLikedIds: React.Dispatch<React.SetStateAction<string[]>>;
  userBadges: Record<string, Badge[]>;
}

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

  const visibleProducts = activeTag
    ? products.filter((p) => p.tags?.includes(activeTag))
    : products;

  useEffect(() => {
    const handleScroll = () => (scrollPosition.current = window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: scrollPosition.current, behavior: "instant" });
  }, [biggerGrid]);

  const toggleGrid = () => {
    scrollPosition.current = window.scrollY;
    setBiggerGrid((prev) => !prev);
  };

  return (
    <div className="p-6">
      {/* FILTERING */}
      {activeTag && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm">
            Đang lọc theo tag:
            <strong className="ml-1 text-pink-600">#{activeTag}</strong>
          </span>
          <button
            onClick={() => setActiveTag(null)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
          >
            Hủy lọc
          </button>
        </div>
      )}

      {/* FILTER TOOLBAR */}
      <div className="flex items-center justify-between mb-5">
        {/* LEFT SIDE — GRID SWITCH */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleGrid}
            className={`px-3 py-2 rounded-lg border transition flex items-center gap-2 ${
              biggerGrid
                ? "bg-pink-100 text-pink-600 border-pink-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {biggerGrid ? <Grid size={18} /> : <LayoutGrid size={18} />}
            <span className="text-sm font-medium">Chế độ thẻ</span>
          </button>
        </div>

        {/* RIGHT SIDE — FILTER BUTTONS + SEARCHBAR */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            "Hot",
            "Mới nhất",
            "Giảm giá",
            "Nhiều like",
            "Cộng đồng",
            "Theo dõi",
            "Video",
          ].map((label, idx) => (
            <button
              key={idx}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 transition border border-gray-300"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ SearchBar đặt ngay dưới toolbar */}
      <div className="mb-6">
        <SearchBar
          userId={"demo-user"} // truyền userId thực tế nếu có
          onSearch={(q) => console.log("Searching:", q)}
        />
      </div>

      {/* GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={biggerGrid ? "large" : "small"}
          initial={{ opacity: 0, x: biggerGrid ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: biggerGrid ? -100 : 100 }}
          transition={{ duration: 0.45 }}
          className={`grid gap-6 ${biggerGrid ? "grid-cols-1" : "grid-cols-1"}`}
        >
          {visibleProducts.map((p) =>
            biggerGrid ? (
              <DealCard
                key={p.id}
                bigger
                deal={{
                  id: p.id,
                  title: p.title,
                  content: p.description ?? undefined,
                  category: p.category ?? undefined,
                  media: p.image_url ? [p.image_url] : [],
                  votes: likesCount[p.id] ?? 0,
                  comments: commentsCount[p.id] ?? 0,
                  author: p.users?.username ?? undefined,
                  author_id: p.users?.id ?? undefined,
                  avatar: p.users?.avatar_url ?? undefined,
                  createdAt: p.created_at ?? undefined,
                  community_title: p.communityName ?? null,
                  community_avatar_url: p.communityIcon ?? null,
                  community_id: p.community_id ?? null,
                  tags: p.tags ?? [],
                  product_tags: p.tags ?? [],
                }}
                onTagClick={(tag) => setActiveTag(tag)}
                vote={() => {}}
                setSelectedDeal={() => {}}
              />
            ) : (
              <SmallCard
                key={p.id}
                product={{
                  id: p.id,
                  title: p.title,
                  image_url: p.image_url ?? undefined,
                  tags: p.tags ?? [],
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