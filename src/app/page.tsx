"use client";

import ProductsList from "@/components/ProductsList/ProductsList";
import { useProductsData } from "./hooks/useProductsData";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { 
    products, 
    likesCount, 
    commentsCount, 
    likedIds, 
    setLikedIds, 
    userBadges, 
    loading 
  } = useProductsData();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <p>Đang tải sản phẩm...</p>
    </div>
  );

  return (
    <div className="pl-6 py-6">
      <ProductsList
        products={products}
        likesCount={likesCount}
        commentsCount={commentsCount}
        likedIds={likedIds}
        setLikedIds={setLikedIds}
        userBadges={userBadges}
      />
    </div>
  );
}