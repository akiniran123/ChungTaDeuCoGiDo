"use client";

import { useEffect, useMemo, useState } from "react";
import HeaderBar from "@/components/HeaderBar/components/HeaderBar";
import { useScrollHeader } from "@/components/HeaderBar/hooks/useScrollHeader";
import { useGridToggle } from "@/components/ProductsList/hooks/useGridToggle";
import TagFilter from "@/components/ProductsList/components/TagFilter";
import ProductsGrid from "@/components/ProductsList/components/ProductsGrid";
import type { ProductsListProps } from "@/components/ProductsList/types/products";

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
  const { biggerGrid, toggleGrid } = useGridToggle();

  const visibleProducts = useMemo(
    () => (activeTag ? products.filter((p) => p.tags?.includes(activeTag)) : products),
    [products, activeTag]
  );

  useEffect(() => {
    const top = scrollPosition.current;
    window.scrollTo({ top, behavior: "auto" });
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