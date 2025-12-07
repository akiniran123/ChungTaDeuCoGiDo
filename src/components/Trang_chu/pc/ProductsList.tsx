"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid } from "lucide-react";
import SmallCard from "@/components/Trang_chu/pc/SmallCard";
import DealCard from "@/components/Trang_chu/pc/DealCard";
import SearchBar from "@/components/Navbar/pc/LogoSearchIcon/SearchBar";
import type { Database } from "@/types/supabase";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
        setShowHeader(false);
      } else {
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

  const categories = [
   
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
      {/* ⭐ HEADER (CATEGORY + SEARCHBAR + FILTERBAR) */}
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
            <div className="flex items-center text-[10px] overflow-x-auto no-scrollbar px-2 py-2 ">
              {categories.map((cat) => (
                <button
  key={cat}
  onClick={() => setSelectedCategory(cat)}
 className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
  selectedCategory === cat
    ? "bg-red-100 text-red-700 shadow-sm underline"
    : "text-gray-700 hover:underline"
}`}
>
  {cat}
</button>
              ))}
            </div>

            {/* SEARCH BAR */}
            <div className="mb-2 py-2 px-2">
              <SearchBar
                userId={"demo-user"}
                onSearch={(q) => console.log("Searching:", q)}
              />
            </div>

            {/* FILTER BAR */}
            <div className="pb-4 flex items-center gap-2 px-2">
              {/* Sort dropdown */}
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

              {/* Toggle grid */}
              <button
                onClick={toggleGrid}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md ${
                  biggerGrid
                    ? "bg-pink-100 text-pink-600 border-pink-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {biggerGrid ? <Grid size={16} /> : <LayoutGrid size={16} />}
                View
              </button>
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