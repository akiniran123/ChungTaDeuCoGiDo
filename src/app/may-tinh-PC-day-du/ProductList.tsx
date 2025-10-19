"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { Eye, ArrowUp, MessageSquare } from "lucide-react";
import Image from "next/image";

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

  const totalPages = Math.max(1, Math.ceil(paginatedProducts.length / itemsPerPage));

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
            <div
              key={p.id}
              onClick={() => onSelectProduct?.(String(p.id))}
              className="cursor-pointer border rounded-xl p-3 hover:shadow-md transition bg-white flex flex-col sm:flex-row gap-4"
            >
              {/* Ảnh bên trái */}
              {p.image_url && (
                <div className="relative w-full sm:w-48 h-40 flex-shrink-0">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Thông tin bên phải */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">{p.title}</h3>

                  {p.price && (
                    <p className="text-red-600 font-bold mt-1">
                      {p.price.toLocaleString("vi-VN")}₫
                    </p>
                  )}

                  {/* ✅ Lượt xem / upvote / bình luận */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Eye size={16} /> {p.views ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUp size={16} /> {p.upvotes ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={16} /> Bình luận
                    </span>
                  </div>
                </div>

                {/* ✅ Thông tin người đăng */}
                {p.users && (
                  <div className="flex items-center gap-2 mt-3">
                    {p.users.avatar_url ? (
                      <Image
                        src={p.users.avatar_url}
                        alt={p.users.username ?? "user"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-300" />
                    )}
                    <span className="text-sm text-gray-700">
                      {p.users.username ?? "Ẩn danh"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

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
