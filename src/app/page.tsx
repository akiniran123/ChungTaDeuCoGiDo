"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import DealCard, { DealType } from "@/components/Trang_chu/DealCard";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Grid } from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  category: string | null;
  condition: string | null;
  description: string | null;
  views: number | null;
  upvotes: number | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [biggerGrid, setBiggerGrid] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, title, price, image_url, category, condition, description, views, upvotes"
        )
        .order("created_at", { ascending: false });

      if (error) console.error("Lỗi tải sản phẩm:", error);
      else setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="p-6">
      {/* 🔘 Nút chuyển đổi */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setBiggerGrid(!biggerGrid)}
          className={`p-2 rounded-lg transition cursor-pointer 
            ${
              biggerGrid
                ? "bg-pink-100 text-pink-500" // khi bật grid lớn → hồng nhạt
                : "hover:bg-pink-50 text-gray-700 hover:text-pink-400"
            }`}
        >
          {biggerGrid ? (
            <Grid size={20} />
          ) : (
            <LayoutGrid size={20} />
          )}
        </button>
      </div>

      {/* 🔥 Phần hiệu ứng trượt giữ nguyên */}
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
                <DealCard
                  key={p.id}
                  deal={{
                    id: Number(p.id),
                    title: p.title,
                    image: p.image_url || undefined,
                    media: p.image_url ? [p.image_url] : [],
                    votes: p.upvotes ?? 0,
                    comments: 0,
                    category: p.category || "",
                    author: "Admin",
                    content: p.description || "",
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
                  className="rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      Không có ảnh
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-600">{p.category}</p>
                    <p className="mt-2 text-indigo-600 font-bold">
                      {p.price ? p.price.toLocaleString() + "₫" : "Liên hệ"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tình trạng: {p.condition}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-2">
                      {p.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400 mt-3">
                      <span>{p.views ?? 0} lượt xem</span>
                      <span>❤️ {p.upvotes ?? 0}</span>
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
