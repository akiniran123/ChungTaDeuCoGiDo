"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  // useScrollHeader (mới) trả về showHeader và forceShow
  const { showHeader, forceShow } = useScrollHeader();
  const { biggerGrid, toggleGrid } = useGridToggle();

  // track last scroll position locally so we can restore it after layout change
  const lastScrollY = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);

  // update lastScrollY on scroll (passive listener for performance)
  useEffect(() => {
    const onScroll = () => {
      lastScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When toggling grid size, restore scroll position and force header visible
  const handleToggleGrid = () => {
    // toggle grid state
    toggleGrid();

    // force header to show immediately (so user sees controls)
    forceShow();

    // restore scroll position after layout change; use a small timeout to allow reflow
    const top = lastScrollY.current || 0;
    window.setTimeout(() => {
      window.scrollTo({ top, behavior: "auto" });
    }, 50);
  };

  const visibleProducts = useMemo(
    () => (activeTag ? products.filter((p) => p.tags?.includes(activeTag)) : products),
    [products, activeTag]
  );

  return (
    <div className="px-6 pb-6">
      {showHeader && (
        <HeaderBar
          biggerGrid={biggerGrid}
          toggleGrid={handleToggleGrid}
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