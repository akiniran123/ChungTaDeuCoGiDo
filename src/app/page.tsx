"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DealCard, { DealType } from "@/components/Trang_chu/DealCard";
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
// Type dữ liệu sản phẩm có thông tin user + badge
// ======================
type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    username: string | null;
    avatar_url: string | null;
    id?: string;
  } | null;
  tags?: string[];
  communityNames?: string[]; // ✅ thêm: tên cộng đồng
};

type Badge = Database["public"]["Tables"]["badges"]["Row"];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [biggerGrid, setBiggerGrid] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [userBadges, setUserBadges] = useState<Record<string, Badge[]>>({});

  // Toggle trạng thái lưu bài
  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Toggle nút thả tim
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
      setLikesCount((prev) => ({
        ...prev,
        [productId]: Math.max(0, (prev[productId] || 1) - 1),
      }));
    } else {
      await supabase.from("product_likes").insert({
        product_id: productId,
        user_id: userId,
      });

      setLikedIds((prev) => [...prev, productId]);
      setLikesCount((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
    }
  };

  const shareProduct = (product: ProductWithUser) => {
    const url = `${window.location.origin}/deal/${product.id}`;
    const title = product.title || "Sản phẩm";
    if (navigator.share) {
      navigator
        .share({ title, url })
        .catch((err) => console.error("Lỗi chia sẻ:", err));
    } else {
      alert(`Copy link để chia sẻ: ${url}`);
    }
  };

  // Lấy dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      // ✅ Lấy sản phẩm + user + tag + cộng đồng
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          users:user_id (
            id,
            username,
            avatar_url
          ),
          product_tags (
            tag_id,
            community_tags:tag_id (
              id,
              name,
              communities:community_id (
                title
              )
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setLoading(false);
        return;
      }

      const productsData = data as any[];

      // ✅ Gắn tag sản phẩm & tên cộng đồng
      const productsWithTags = productsData.map((p) => ({
        ...p,
        tags: (p.product_tags || []).map(
          (pt: any) => pt.community_tags?.name || "Không rõ"
        ),
        communityNames: (p.product_tags || [])
          .map((pt: any) => pt.community_tags?.communities?.title)
          .filter(Boolean),
      }));

      setProducts(productsWithTags);

      // ✅ Lấy số lượng comment
      const commentCounts: Record<string, number> = {};
      await Promise.all(
        productsWithTags.map(async (p) => {
          const { count } = await supabase
            .from("comments")
            .select("*", { count: "exact" })
            .eq("product_id", p.id);
          commentCounts[p.id] = count || 0;
        })
      );
      setCommentsCount(commentCounts);

      // ✅ Lấy likes
      const { data: likesData } = await supabase
        .from("product_likes")
        .select("product_id, user_id");

      const likeCounts: Record<string, number> = {};
      const userLikes: string[] = [];
      likesData?.forEach((like) => {
        likeCounts[like.product_id] =
          (likeCounts[like.product_id] || 0) + 1;
      });

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user && likesData) {
        userLikes.push(
          ...likesData
            .filter((like) => like.user_id === user.id)
            .map((like) => like.product_id)
        );
      }

      setLikesCount(likeCounts);
      setLikedIds(userLikes);

      // ✅ Lấy huy hiệu cho từng user
      const uniqueUserIds = [
        ...new Set(productsWithTags.map((p) => p.users?.id).filter(Boolean)),
      ] as string[];

      const badgesMap: Record<string, Badge[]> = {};
      await Promise.all(
        uniqueUserIds.map(async (uid) => {
          const { data: badgeData, error: badgeErr } = await supabase
            .from("user_badges")
            .select(
              `
              badge_id,
              badges:badge_id (
                id,
                name,
                icon,
                milestone_type,
                milestone_value
              )
            `
            )
            .eq("user_id", uid);

          if (!badgeErr && badgeData) {
            badgesMap[uid] = badgeData
              .map((b) => b.badges)
              .filter((b): b is Badge => !!b);
          }
        })
      );

      setUserBadges(badgesMap);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // ========== Hiển thị khi đang tải ==========
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );

  // ========== Giao diện ==========
  return (
    <div className="p-6">
      {/* 🔘 Nút chuyển grid */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setBiggerGrid(!biggerGrid)}
          className={`p-2 rounded-lg transition cursor-pointer ${
            biggerGrid
              ? "bg-pink-100 text-pink-500"
              : "hover:bg-pink-50 text-gray-700 hover:text-pink-400"
          }`}
        >
          {biggerGrid ? <Grid size={20} /> : <LayoutGrid size={20} />}
        </button>
      </div>

      {/* 🔥 Danh sách */}
      <div className="overflow-hidden">
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
                    votes: likesCount[p.id] ?? 0,
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
                    <div className="flex justify-between items-start">
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

                    {/* 🏷️ Tag loại hàng + cộng đồng */}
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

                    <p className="text-xs text-gray-500 mt-1">
                      Tình trạng: {p.condition}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-2">
                      {p.description}
                    </p>

                    {p.users && (
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center">
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
                              {/* 🏅 Huy hiệu */}
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
                        </div>

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
                              likedIds.includes(p.id) ? "currentColor" : "none"
                            }
                          />
                          <span className="text-xs font-semibold">
                            {likesCount[p.id] ?? 0}
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
