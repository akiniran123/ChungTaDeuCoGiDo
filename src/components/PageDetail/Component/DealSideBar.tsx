"use client";

import { useState } from "react";
import DealOptions from "@/components/PageDetail/Component/DealOptions";
import type { DealDetailResult } from "@/components/PageDetail/hooks/getDealDetail";

export default function DealSidebar({ 
  product 
}: { 
  product: DealDetailResult["product"] 
}) {
  const [adding, setAdding] = useState(false);

  // 1. Xử lý Price: Đã an toàn nhờ toán tử ??
  const safePrice = product.price ?? 0;

  // 2. Xử lý Sizes: Sử dụng dữ liệu đã được chuẩn hóa từ hook
  const defaultSizes = ["S", "M", "L", "XL"];
  
  const finalSizes = (product.sizes && product.sizes.length > 0) 
    ? product.sizes 
    : defaultSizes;

  const handleAddToCart = async ({ size, qty }: { size?: string | null; qty: number }) => {
    try {
      setAdding(true);
      console.log("Add to cart:", { id: product.id, size, qty });
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async ({ size, qty }: { size?: string | null; qty: number }) => {
    console.log("Buy now:", { id: product.id, size, qty });
  };

  return (
    <div className="space-y-6">
      <DealOptions
        price={safePrice}
        sizes={finalSizes}
        initialSize={finalSizes[0] ?? null}
        initialQty={1}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        disabled={adding}
      />

      <div>
        <h2 className="font-semibold mb-2 text-gray-900">Mô tả</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {product.description ?? "Chưa có mô tả cho sản phẩm này."}
        </p>
      </div>
    </div>
  );
}