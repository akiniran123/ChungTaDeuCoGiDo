"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid } from "lucide-react";
import SmallCard from "@/components/Trang_chu/pc/SmallCard";
import DealCard from "@/components/Trang_chu/pc/DealCard";
import type { Database } from "@/types/supabase";
import SearchBar from "@/components/Navbar/pc/LogoSearchIcon/SearchBar";

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

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const visibleProducts = activeTag
    ? products.filter((p) => p.tags?.includes(activeTag))
    : products;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Kéo xuống
        setShowHeader(false);
      } else {
        // Kéo lên
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
      scrollPosition.current = currentScrollY;
    };

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

  // ⭐ Category list
  const categories = [
    "eBay Live",
    "Saved",
    "Electronics",
    "Motors",
    "Fashion",
    "Collectibles & Art",
    "Sports",
    "Health & Beauty",
    "Industrial equipment",
    "Home & Garden",
  ];

  return (
    <div className="px-6 pb-6">
      {/* ⭐ HEADER (CATEGORY + SEARCHBAR) */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-30 bg-white"
          >
            {/* CATEGORY LIST */}
            <div className="flex items-center gap-0 text-[12px] overflow-x-auto no-scrollbar border-gray-200 ">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="whitespace-nowrap text-gray-700 hover:text-blue-600 transition pb-[2px] hover:border-b hover:border-blue-600"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* SEARCH BAR */}
            <div className="mt-2 mb-2 py-2 px-2">
              <SearchBar
                userId={"demo-user"}
                onSearch={(q) => console.log("Searching:", q)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ TAG FILTER IF ACTIVE */}
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

      {/* ⭐ FILTER TOOLBAR */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Toggle grid */}
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

          {/* Filter buttons */}
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
      </div>

      {/* ⭐ PRODUCT GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={biggerGrid ? "large" : "small"}
          initial={{ opacity: 0, x: biggerGrid ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: biggerGrid ? -100 : 100 }}
          transition={{ duration: 0.45 }}
          className="grid gap-6 grid-cols-1"
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