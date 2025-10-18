"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import DealCard, { DealType } from "@/components/Trang_chu/DealCard";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid, Bookmark, BookmarkCheck, Heart as HeartIcon, Share2 } from "lucide-react";
import type { Database } from "@/types/supabase";

// ======================
// Type dữ liệu sản phẩm có thông tin user
// ======================
type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [biggerGrid, setBiggerGrid] = useState(false);
  const [saved, setSaved] = useState<string[]>([]); // Danh sách ID đã lưu
  const [likedIds, setLikedIds] = useState<string[]>([]); // ID sản phẩm đã thả tim
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({}); // số lượng comment theo product_id

  // Toggle trạng thái lưu bài
  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Toggle nút thả tim cho sản phẩm
  const toggleLike = async (productId: string, currentUpvotes: number) => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    const liked = likedIds.includes(productId);

    if (liked) {
      await supabase
        .from("products")
        .update({ upvotes: currentUpvotes > 0 ? currentUpvotes - 1 : 0 })
        .eq("id", productId);
      setLikedIds((prev) => prev.filter((id) => id !== productId));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, upvotes: p.upvotes ? p.upvotes - 1 : 0 }
            : p
        )
      );
    } else {
      await supabase
        .from("products")
        .update({ upvotes: currentUpvotes + 1 })
        .eq("id", productId);
      setLikedIds((prev) => [...prev, productId]);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, upvotes: p.upvotes ? p.upvotes + 1 : 1 }
            : p
        )
      );
    }
  };

  // Hàm chia sẻ sản phẩm
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

  // Lấy dữ liệu sản phẩm và số lượng comment
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          users:user_id (
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } else {
        const productsData = data as ProductWithUser[];
        setProducts(productsData);

        // Lấy số lượng comment cho mỗi product
        const commentCounts: Record<string, number> = {};
        await Promise.all(
          productsData.map(async (p) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact" })
              .eq("product_id", p.id);
            commentCounts[p.id] = count || 0;
          })
        );
        setCommentsCount(commentCounts);
      }
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

  // ========== Giao diện chính ==========
  return (
    <div className="p-6">
      {/* 🔘 Nút chuyển đổi dạng hiển thị */}
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

      {/* 🔥 Danh sách sản phẩm */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={biggerGrid ? "large" : "small"}
            initial={{
              opacity: 0,
              x: biggerGrid ? 100 : -100,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: biggerGrid ? -100 : 100,
              scale: 0.98,
            }}
            transition={{
              duration: 0.45,
              ease: "easeInOut",
            }}
            className={`grid gap-6 ${
              biggerGrid
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {products.map((p) =>
              biggerGrid ? (
                // ========== DẠNG LỚN ==========
                <DealCard
                  key={p.id}
                  deal={{
                    id: p.id,
                    title: p.title,
                    image: p.image_url || undefined,
                    media: p.image_url ? [p.image_url] : [],
                    votes: p.upvotes ?? 0,
                    comments: 0,
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
                // ========== DẠNG NHỎ ==========
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
                >
                  {/* Ảnh sản phẩm + link đến /deal/[id] */}
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

                  {/* Thông tin sản phẩm */}
                  <div className="p-4">
                    {/* Tiêu đề + nút lưu */}
                    <div className="flex justify-between items-start">
                      <Link href={`/deal/${p.id}`}>
                        <h3 className="font-semibold text-lg cursor-pointer hover:text-pink-500">
                          {p.title}
                        </h3>
                      </Link>

                      {/* 🔖 Nút lưu */}
                      <button
                        onClick={() => toggleSave(p.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
                          saved.includes(p.id)
                            ? "bg-pink-100 text-pink-500"
                            : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                      >
                        {saved.includes(p.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
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

                    {/* 👤 User + thời gian + số comment (comment chỉ hiện ở bên phải) */}
                    {p.users && (
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center">
                          <img
                            src={p.users.avatar_url || "/default-avatar.png"}
                            alt={p.users.username || "User"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-700">
                              {p.users.username || "Người dùng"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {p.created_at
                                ? new Date(p.created_at).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Không rõ thời gian"}
                            </p>
                          </div>
                        </div>

                        {/* Số comment ở bên phải cùng hàng với avatar */}
                        <p className="text-xs text-gray-500">
                          {commentsCount[p.id] ?? 0} bình luận
                        </p>
                      </div>
                    )}

                    {/* 🔥 Nút thả tim + chia sẻ */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{p.views ?? 0} lượt xem</span>

                      <div className="flex items-center gap-2">
                        {/* Nút thả tim */}
                        <button
                          onClick={() => toggleLike(p.id, p.upvotes ?? 0)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${
                            likedIds.includes(p.id)
                              ? "bg-pink-100 text-pink-500"
                              : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                          }`}
                        >
                          <HeartIcon size={14} fill={likedIds.includes(p.id) ? "currentColor" : "none"} />
                          <span className="text-xs font-semibold">{p.upvotes ?? 0}</span>
                        </button>

                        {/* Nút chia sẻ */}
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
