"use client";

import React from "react";
import Image from "next/image";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusLabel = product.quantity === 0 ? "Hết hàng" : "Còn hàng";

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="w-full h-44 md:h-48 bg-gray-50 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title ?? "Product image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Không có hình
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
          {product.title ?? "Không tiêu đề"}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-700 font-medium">
            {product.price != null
              ? `${Number(product.price).toLocaleString()}₫`
              : "Thỏa thuận"}
          </p>

          <p className="text-xs text-gray-400">
            {product.created_at
              ? new Date(product.created_at).toLocaleDateString("vi-VN")
              : ""}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Người bán: {product.user_id?.slice(0, 6) || "Ẩn"}</span>
          <span>·</span>
          <span>Trạng thái: {statusLabel}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard; // ✅ bắt buộc export default
