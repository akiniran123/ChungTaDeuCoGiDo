"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Product = {
  id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  category: string | null;
  condition: string | null;
  description: string | null;
  views: number | null;
  upvotes: number | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, image_url, category, condition, description, views, upvotes")
        .order("created_at", { ascending: false });

      if (error) console.error("Lỗi tải sản phẩm:", error);
      else setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl shadow hover:shadow-lg transition bg-white overflow-hidden"
        >
          {p.image_url ? (
            <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
              Không có ảnh
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.category}</p>
            <p className="mt-2 text-indigo-600 font-bold">
              {p.price ? p.price.toLocaleString() + "₫" : "Liên hệ"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Tình trạng: {p.condition}</p>
            <p className="text-sm text-gray-700 line-clamp-2 mt-2">{p.description}</p>
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>{p.views ?? 0} lượt xem</span>
              <span>❤️ {p.upvotes ?? 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
