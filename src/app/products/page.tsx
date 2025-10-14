'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Lỗi khi tải sản phẩm:', error.message);
      } else if (data) {
        const normalized = data.map((p) => {
          let images: string[] = [];

          if (Array.isArray(p.images)) {
            images = p.images;
          } else if (typeof p.images === 'string') {
            try {
              const parsed = JSON.parse(p.images);
              if (Array.isArray(parsed)) images = parsed;
              else images = [p.images];
            } catch {
              images = [p.images];
            }
          }

          return {
            ...p,
            images,
          } as Product;
        });

        setProducts(normalized);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Đang tải sản phẩm...</p>;
  if (products.length === 0)
    return <p className="text-center mt-10">Không có sản phẩm nào.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((p) => {
        // ✅ Lấy link ảnh đầy đủ từ Supabase
        const imageUrl =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images[0]
            : '/no-image.jpg';

        return (
          <div
            key={p.id}
            className="border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 hover:shadow-lg transition"
          >
            <Image
              src={imageUrl}
              alt={p.title || 'Sản phẩm'}
              width={400}
              height={300}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {p.title || 'Không có tiêu đề'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {p.price ? `${p.price.toLocaleString()}₫` : 'Chưa có giá'}
              </p>
              {p.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
