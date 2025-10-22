"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import ProductItem from "./ProductItem"; // ✅ Giữ nguyên import
import ProductActions from "./ProductActions"; // ✅ Giữ nguyên (nếu ProductItem vẫn dùng)
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 9;

  const isExternal = Array.isArray(paginated);
  const paginatedProducts = isExternal ? paginated : [];

  const totalPages = Math.max(
    1,
    Math.ceil(paginatedProducts.length / itemsPerPage)
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

  const animateKey = isExternal
    ? `external-${paginatedProducts.length}-${paginatedProducts[0]?.id ?? 0}`
    : `internal-${currentPage}`;

  if (!paginatedProducts || paginatedProducts.length === 0) {
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
          {paginatedProducts.map((p) => (
            <React.Fragment key={p.id}>
              {/* ✅ Giữ nguyên ProductItem */}
              <div className="flex flex-col">
                <ProductItem product={p} />
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Phân trang */}
      {!isExternal && (
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
