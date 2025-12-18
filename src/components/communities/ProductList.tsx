"use client";

import React from "react";
import type { Database } from "@/types/supabase";
import ProductCard from "./ProductCard"; // chắc chắn import default

// Kiểu Product từ Supabase
type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductListProps {
  products: Product[];
}

// ✅ Component ProductList chuẩn export default
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">Chưa có sản phẩm nào</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
