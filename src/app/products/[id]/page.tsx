"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/supabase";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } else if (data) {
        setProduct({
          ...data,
          specs: (data.specs as Record<string, any>) || null, // ✅ ép kiểu JSON → object
          images: data.images ? JSON.parse(data.images) : null, // ✅ parse mảng ảnh
        });
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-600 mb-2">{product.price}₫</p>
      <img
        src={product.images?.[0] || "/no-image.jpg"}
        alt={product.title}
        className="w-full max-w-md rounded-md"
      />
      {product.description && (
        <p className="mt-4 text-gray-700">{product.description}</p>
      )}
    </div>
  );
}
