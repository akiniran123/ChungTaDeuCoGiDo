"use client";

import Link from "next/link";
import { Product } from "@/types";
import ProductActions from "./ProductActions";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

type UIProduct = Product & {
  name?: string | null;
  shortDesc?: string | null;
  images?: string[] | string | null;
  seller?: { id?: string; name?: string; avatar?: string } | null;
};

export default function ProductItem({ product }: { product: UIProduct }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const images: string[] = (() => {
    const imgs = product.images ?? product.image_url ?? null;
    if (!imgs) return [];
    if (Array.isArray(imgs)) return imgs as string[];
    if (typeof imgs === "string") {
      try {
        const parsed = JSON.parse(imgs);
        return Array.isArray(parsed) ? parsed : [imgs];
      } catch {
        return [imgs];
      }
    }
    return [];
  })();

  const displayName = (product as any).name ?? product.title ?? "Sản phẩm không tên";
  const displayShort = (product as any).shortDesc ?? product.description ?? "";
  const firstImage = images[0] ?? product.image_url ?? "/placeholder.png";

  const handleSaveToCart = () => {
    addToCart({
      id: String(product.id),
      name: displayName,
      price: Number(product.price ?? 0),
      image: firstImage,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <div className="relative flex flex-col border p-4 rounded-lg shadow-sm bg-white w-full min-h-[220px]">
      {/* ===== ICON LƯU ===== */}
      <button
        onClick={handleSaveToCart}
        className={`absolute top-3 right-3 flex items-center justify-center rounded-full px-2.5 py-2 shadow-sm border transition-all cursor-pointer
          ${
            added
              ? "bg-pink-100 border-pink-200 text-pink-600"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:text-pink-600 hover:bg-gray-200"
          }`}
        title="Lưu vào giỏ hàng"
      >
        <Bookmark size={16} strokeWidth={2} />
      </button>

      {/* Khối nội dung chính */}
      <div className="flex flex-1 items-start gap-4">
        {/* Ảnh sản phẩm */}
        <Link href={`/may-tinh-PC-day-du/${product.id}`}>
          <div className="w-24 h-24 flex items-center justify-center rounded bg-white cursor-pointer">
            <img
              src={firstImage}
              alt={displayName}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </Link>

        {/* Thông tin + người bán */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            {product.seller?.name && (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={product.seller.avatar ?? "/avatar-placeholder.png"}
                  alt={product.seller.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-gray-800">
                  {product.seller.name}
                </span>
              </div>
            )}

            <h3 className="font-semibold text-lg">
              <Link
                href={`/may-tinh-PC-day-du/${product.id}`}
                className="text-gray-900 hover:text-gray-700 hover:underline transition-colors duration-200"
              >
                {displayName}
              </Link>
            </h3>

            <p className="text-gray-600 text-sm line-clamp-2">{displayShort}</p>
          </div>

          <p className="text-red-600 font-bold mt-2">
            {(product.price ?? 0).toLocaleString()} ₫
          </p>
        </div>
      </div>

      {/* ✅ 3 nút ở góc dưới phải (nằm trong khung) */}
      <div className="absolute bottom-3 right-3 translate-x-[-8px]">
        <ProductActions productId={String(product.id)} />
      </div>
    </div>
  );
}
