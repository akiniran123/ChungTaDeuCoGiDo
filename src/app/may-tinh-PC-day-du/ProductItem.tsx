"use client";

import React, { useState } from "react";
import { Eye, Bookmark, BookmarkCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions";
import type { Product } from "@/types";
import { useCart } from "@/app/context/CartContext";

// ------------------
// Kiểu mở rộng Product (có users)
// ------------------
type ProductWithUser = Product & {
  users?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

export default function ProductItem({ product }: { product: ProductWithUser }) {
  const p = product;
  const [saved, setSaved] = useState(false);
  const { addToCart } = useCart();

  // Lấy ảnh chính
  const firstImage = p.image_url ?? "/placeholder.png";

  const handleSave = () => {
    setSaved(true);
    addToCart({
      id: String(p.id),
      name: p.title ?? "Sản phẩm",
      price: Number(p.price ?? 0),
      image: firstImage,
      quantity: 1,
    });
    setTimeout(() => setSaved(false), 1000);
  };

  return (
    <div
      key={p.id}
      className="relative border rounded-xl p-3 hover:shadow-md transition bg-white flex flex-col sm:flex-row gap-4 select-none"
    >
      {/* ===== NÚT LƯU TRÊN GÓC ===== */}
      <button
        onClick={handleSave}
        className={`absolute top-2 right-2 z-[50] flex items-center justify-center rounded-full p-2 border shadow-sm cursor-pointer transition-all duration-200
          ${saved
            ? "bg-pink-100 border-pink-200 text-pink-600"
            : "bg-gray-100 border-gray-300 text-gray-700 hover:text-pink-600 hover:bg-gray-200"
          }`}
        title="Lưu sản phẩm"
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>

      {/* Ảnh bên trái */}
      {p.image_url && (
        <Link
          href={`/deal/${p.id}`}
          className="relative w-full sm:w-48 h-40 flex-shrink-0 block cursor-pointer"
        >
          <Image
            src={p.image_url}
            alt={p.title}
            fill
            className="object-cover rounded-lg"
          />
        </Link>
      )}

      {/* Thông tin bên phải */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          {/* Tiêu đề */}
          <Link href={`/deal/${p.id}`} className="cursor-pointer">
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-pink-600">
              {p.title}
            </h3>
          </Link>

          {p.price && (
            <p className="text-red-600 font-bold mt-1">
              {p.price.toLocaleString("vi-VN")}₫
            </p>
          )}

          {/* ✅ Lượt xem */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Eye size={16} /> {p.views ?? 0} lượt xem
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

      {/* ✅ Các nút hành động */}
      <div className="absolute bottom-3 right-3">
        <ProductActions productId={p.id} />
      </div>
    </div>
  );
}
