"use client";
import React from "react";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  condition?: string;
  seller?: string;
}

export default function ProductCard({ image, title, price, condition, seller }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-1">
        <h2 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h2>
        {condition && <span className="text-xs text-gray-500">{condition}</span>}
        <p className="text-lg font-bold text-gray-900">{price}</p>
        {seller && <p className="text-xs text-gray-500">Seller: {seller}</p>}
      </div>
    </div>
  );
}
