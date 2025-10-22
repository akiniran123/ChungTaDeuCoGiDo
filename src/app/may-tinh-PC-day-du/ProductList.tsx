"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import ProductItem from "./ProductItem";
import { supabase } from "@/lib/supabase/client";

// ------------------
// Kiểu mở rộng Product (có users)
// ------------------
type ProductWithUser = Product & {
  users?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

type Props = {
  paginated?: ProductWithUser[];
  onSelectProduct?: (id: string) => void;
};

export default function ProductList({ paginated, onSelectProduct }: Props) {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 9;

  // ✅ Lấy dữ liệu ban đầu từ Supabase
  useEffect(() => {
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, users(username, avatar_url)")
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data as ProductWithUser[]);
    };
    fetchInitial();

    // ✅ Đăng ký realtime
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Realtime update:", payload);

          setProducts((prev) => {
            if (payload.eventType === "INSERT") {
              // Thêm sản phẩm mới lên đầu
              const newProduct = payload.new as ProductWithUser;
              return [newProduct, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              // Cập nhật sản phẩm
              const updated = payload.new as ProductWithUser;
              return prev.map((p) => (p.id === updated.id ? updated : p));
            }
            if (payload.eventType === "DELETE") {
              // Xóa sản phẩm
              const deleted = payload.old as ProductWithUser;
              return prev.filter((p) => p.id !== deleted.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    // ✅ Cleanup khi rời trang
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Nếu prop `paginated` được truyền thì ưu tiên nó
  const displayProducts = paginated ?? products;

  const totalPages = Math.max(
    1,
    Math.ceil(displayProducts.length / itemsPerPage)
  );

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const animateKey = `page-${currentPage}-${displayProducts.length}`;

  if (!displayProducts || displayProducts.length === 0) {
    return <p className="text-gray-500">Không có sản phẩm nào.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={animateKey}
          variants={variants}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-4"
        >
          {displayProducts.map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Phân trang (nếu cần) */}
      {!paginated && (
        <div className="flex justify-center gap-2 mt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setDirection(-1);
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setDirection(1);
              setCurrentPage((p) => Math.min(totalPages, p + 1));
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
