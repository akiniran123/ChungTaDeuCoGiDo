"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DealCard, { DealType } from "@/components/Trang_chu/pc/DealCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Grid,
  Bookmark,
  BookmarkCheck,
  Heart as HeartIcon,
  Share2,
} from "lucide-react";
import type { Database } from "@/types/supabase";

// ======================
// Type dữ liệu
// ======================
type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    username: string | null;
    avatar_url: string | null;
    id?: string;
  } | null;

  tags?: string[];
  communityNames?: string[];

  // ⭐ Thêm mới
  communityName?: string | null;
  communityIcon?: string | null;
  mainTag?: string | null;
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
  userBadges,
}: ProductsListProps) {
  const [biggerGrid, setBiggerGrid] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollPosition.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleGrid = () => {
    scrollPosition.current = window.scrollY;
    setBiggerGrid((prev) => !prev);
  };

  useEffect(() => {
    window.scrollTo({ top: scrollPosition.current, behavior: "instant" });
  }, [biggerGrid]);

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const toggleLike = async (productId: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    const alreadyLiked = likedIds.includes(productId);

    if (alreadyLiked) {
      await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", userId);

      setLikedIds((prev) => prev.filter((id) => id !== productId));
      setLocalLikesCount((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 1) - 1,
      }));
    } else {
      await supabase.from("product_likes").insert({
        product_id: productId,
        user_id: userId,
      });

      setLikedIds((prev) => [...prev, productId]);
      setLocalLikesCount((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
    }
  };

  const shareProduct = (product: ProductWithUser) => {
    const url = `${window.location.origin}/deal/${product.id}`;
    const title = product.title || "Sản phẩm";
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      alert(`Copy link để chia sẻ: ${url}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg transition cursor-pointer ${
            biggerGrid
              ? "bg-pink-100 text-pink-500"
              : "hover:bg-pink-50 text-gray-700 hover:text-pink-400"
          }`}
        >
          {biggerGrid ? <Grid size={20} /> : <LayoutGrid size={20} />}
        </button>
      </div>

      <div className="overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={biggerGrid ? "large" : "small"}
            initial={{ opacity: 0, x: biggerGrid ? 100 : -100, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: biggerGrid ? -100 : 100, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={`grid gap-6 ${
              biggerGrid
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {products.map((p) =>
              biggerGrid ? (
                <DealCard
                  key={p.id}
                  deal={{
                    id: p.id,
                    title: p.title,
                    image: p.image_url || undefined,
                    media: p.image_url ? [p.image_url] : [],
                    votes: localLikesCount[p.id] ?? 0,
                    comments: commentsCount[p.id] ?? 0,
                    category: p.category || "",
                    author: p.users?.username || "Người dùng",
                    avatar: p.users?.avatar_url || "/default-avatar.png",
                    content: p.description || "",
                    createdAt: p.created_at
                      ? new Date(p.created_at).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : undefined,
                  } as DealType}
                  vote={() => {}}
                  setSelectedDeal={() => {}}
                  bigger
                />
              ) : (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
                >
                  <Link href={`/deal/${p.id}`}>
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-48 object-cover cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer">
                        Không có ảnh
                      </div>
                    )}
                  </Link>

                  <div className="p-4">

                    {/* ⭐ HIỂN THỊ CỘNG ĐỒNG */}
                    {p.communityName && (
                      <div className="flex items-center gap-2 mb-2">
                        {p.communityIcon && (
                          <img
                            src={p.communityIcon}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-sm text-blue-600 font-semibold">
                          {p.communityName}
                        </span>
                      </div>
                    )}

                    {/* ⭐ HIỂN THỊ TAG CHÍNH */}
                    {p.mainTag && (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                        #{p.mainTag}
                      </span>
                    )}

                    {/* ⭐ LIST TAG + COMMUNITY TAG */}
                    {(p.tags?.length || p.communityNames?.length) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {p.communityNames?.map((cName, i) => (
                          <span
                            key={`c-${i}`}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                          >
                            {cName}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-start mt-2">
                      <Link href={`/deal/${p.id}`}>
                        <h3 className="font-semibold text-lg cursor-pointer hover:text-pink-500">
                          {p.title}
                        </h3>
                      </Link>

                      <button
                        onClick={() => toggleSave(p.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
                          saved.includes(p.id)
                            ? "bg-pink-100 text-pink-500"
                            : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                      >
                        {saved.includes(p.id) ? (
                          <BookmarkCheck size={16} />
                        ) : (
                          <Bookmark size={16} />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600">{p.category}</p>
                    <p className="mt-2 text-indigo-600 font-bold">
                      {p.price ? `${p.price.toLocaleString()}₫` : "Liên hệ"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Tình trạng: {p.condition}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-2">
                      {p.description}
                    </p>

                    {p.users && (
                      <div className="flex justify-between items-center mt-3">
                        <Link
                          href={`/user/${p.users.username}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center hover:opacity-80 transition"
                        >
                          <img
                            src={p.users.avatar_url || "/default-avatar.png"}
                            alt={p.users.username || "User"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="ml-2 flex flex-col">
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium text-gray-700">
                                {p.users.username || "Người dùng"}
                              </p>

                              {userBadges[p.users.id || ""]?.length ? (
                                <div className="flex items-center gap-1">
                                  {userBadges[p.users.id || ""]
                                    .slice(0, 2)
                                    .map((badge) => (
                                      <img
                                        key={badge.id}
                                        src={badge.icon}
                                        alt={badge.name}
                                        title={badge.name}
                                        className="w-4 h-4 object-contain"
                                      />
                                    ))}
                                </div>
                              ) : null}
                            </div>

                            <p className="text-xs text-gray-400">
                              {p.created_at
                                ? new Date(p.created_at).toLocaleString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "Không rõ thời gian"}
                            </p>
                          </div>
                        </Link>

                        <p className="text-xs text-gray-500">
                          {commentsCount[p.id] ?? 0} bình luận
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {p.views ?? 0} lượt xem
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(p.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
                            likedIds.includes(p.id)
                              ? "bg-pink-100 text-pink-500"
                              : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                          }`}
                        >
                          <HeartIcon
                            size={14}
                            fill={
                              likedIds.includes(p.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                          <span className="text-xs font-semibold">
                            {localLikesCount[p.id] ?? 0}
                          </span>
                        </button>

                        <button
                          onClick={() => shareProduct(p)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
