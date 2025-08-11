'use client';

import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  image: string;
  title: string;
  price: string;
  condition?: string;
  seller?: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, idx) => (
        <ProductCard key={idx} {...product} />
      ))}
    </div>
  );
}
