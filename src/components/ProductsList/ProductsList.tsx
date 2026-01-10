"use client";

import { useMemo, useState } from "react";
import TagFilter from "@/components/ProductsList/components/TagFilter";
import ProductsGrid from "@/components/ProductsList/components/ProductsGrid";
import { useGridContext } from "@/components/layouts/AppLayout"; // Đường dẫn tới AppLayout của bạn
import type { ProductsListProps } from "@/components/ProductsList/types/products";

// Sử dụng trực tiếp ProductsListProps gốc, không cần Extended vì biggerGrid lấy từ Context
export default function ProductsList({
  products,
  likesCount,
  commentsCount,
  likedIds,
  setLikedIds,
}: ProductsListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Lấy trạng thái từ AppLayout Context
  const { biggerGrid } = useGridContext();

  // Lọc sản phẩm dựa trên tag đã chọn
  const visibleProducts = useMemo(
    () => (activeTag ? products.filter((p) => p.tags?.includes(activeTag)) : products),
    [products, activeTag]
  );

  return (
    <div className="px-6 pb-6">
      {/* 1. Thanh lọc Tag */}
      <TagFilter activeTag={activeTag} onClear={() => setActiveTag(null)} />

      {/* 2. Lưới sản phẩm - Tự động thay đổi khi toggle ở HeaderBar (thông qua Context) */}
      <ProductsGrid
        products={visibleProducts}
        biggerGrid={biggerGrid}
        likesCount={likesCount}
        commentsCount={commentsCount}
        likedIds={likedIds}
        setLikedIds={setLikedIds}
        setActiveTag={setActiveTag}
      />
    </div>
  );
}