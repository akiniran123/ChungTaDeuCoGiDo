"use client"

import Link from "next/link"
import { Product } from "./types.local.bak"
import ProductActions from "./ProductActions"
import { useState } from "react"
import { Bookmark } from "lucide-react"
import { useCart } from "@/app/context/CartContext"; // ✅ Thêm dòng này

export default function ProductItem({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart() // ✅ Lấy hàm addToCart từ context

  const handleSaveToCart = () => {
    addToCart({
      ...product,
      image: product.images?.[0] || "", // ✅ lấy ảnh đầu tiên của sản phẩm
      quantity: 1, // ✅ thêm số lượng mặc định
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 600)
  }

  return (
    <div className="relative flex items-stretch border p-4 rounded-lg shadow-sm bg-white w-full min-h-[180px]">
      {/* ===== ICON LƯU (Bookmark chuẩn style 3 icon) ===== */}
      <button
        onClick={handleSaveToCart}
        className={`absolute top-3 right-3 flex items-center justify-center rounded-full px-2.5 py-2 shadow-sm border transition-all cursor-pointer
          ${
            added
              ? "bg-pink-100 border-pink-200 text-pink-600"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:text-pink-600 hover:bg-gray-200"
          }
        `}
        title="Lưu vào giỏ hàng"
      >
        <Bookmark size={16} strokeWidth={2} />
      </button>

      <div className="flex-1 flex flex-col gap-3">
        {/* Người bán */}
        {product.seller && (
          <div className="flex items-center gap-2 mb-2 ml-27">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-gray-800">
              {product.seller.name}
            </span>
          </div>
        )}

        <div className="flex gap-4">
          {/* Ảnh */}
          <Link href={`/may-tinh-PC-day-du/${product.id}`}>
            <div className="w-24 h-24 flex items-center justify-center rounded bg-white cursor-pointer">
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </Link>

          {/* Thông tin */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">
              <Link
                href={`/may-tinh-PC-day-du/${product.id}`}
                className="text-gray-900 hover:text-gray-700 hover:underline transition-colors duration-200 !no-underline"
                style={{ color: "#1f2937" }}
              >
                {product.name}
              </Link>
            </h3>

            <p className="text-gray-600 text-sm">{product.shortDesc}</p>

            <p className="text-red-600 font-bold mt-2">
              {product.price.toLocaleString()} ₫
            </p>
          </div>
        </div>
      </div>

      {/* Vote, bình luận, chia sẻ */}
      <div className="ml-4 flex flex-col justify-end">
        <ProductActions productId={product.id} />
      </div>
    </div>
  )
}
