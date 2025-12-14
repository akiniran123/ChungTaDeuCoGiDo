// components/Trang_chu/pc/ProductsList.tsx
"use client";

import { useEffect, useState } from "react";
import HeaderBar from "@/components/Widgets/HeaderBar";
import { useScrollHeader } from "@/hooks/useScrollHeader";
import { useGridToggle } from "@/hooks/GridToggle/useGridToggle";
import TagFilter from "@/components/Widgets/ProductsList/TagFilter";
import ProductsGrid from "@/components/Widgets/ProductsList/ProductsGrid";
import type { ProductsListProps } from "@/types/products";

console.log("HeaderBar:", HeaderBar);
console.log("TagFilter:", TagFilter);
console.log("ProductsGrid:", ProductsGrid);

export default function ProductsList({
  products,
  likesCount,
  commentsCount,
  likedIds,
  setLikedIds,
}: ProductsListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { showHeader, scrollPosition } = useScrollHeader();
  const { biggerGrid, toggleGrid, scrollPosition: gridScroll } = useGridToggle();

  const visibleProducts = activeTag
    ? products.filter((p) => p.tags?.includes(activeTag))
    : products;

  useEffect(() => {
    window.scrollTo({ top: scrollPosition.current, behavior: "auto" });
  }, [biggerGrid, scrollPosition]);

  return (
    <div className="px-6 pb-6">
      {showHeader && (
        <HeaderBar
          biggerGrid={biggerGrid}
          toggleGrid={toggleGrid}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      <TagFilter activeTag={activeTag} onClear={() => setActiveTag(null)} />

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