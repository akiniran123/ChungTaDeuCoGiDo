"use client"

import Link from "next/link"
import { Product } from "./types"
import ProductActions from "./ProductActions"

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="flex items-stretch border p-4 rounded-lg shadow-sm bg-white w-full min-h-[180px]">
      <div className="flex-1 flex flex-col gap-3">
        {/* Người bán (không bọc link) */}
      
{/* Người bán (không bọc link) */}
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
          {/* Ảnh (bọc link, KHÔNG có khung viền) */}
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
            {/* Tên sản phẩm (bọc link, màu đen nhạt) */}
         <h3 className="font-semibold text-lg">
  <Link
    href={`/may-tinh-PC-day-du/${product.id}`}
    className="text-gray-900 hover:text-gray-700 hover:underline transition-colors duration-200 !no-underline"
    style={{ color: "#1f2937" }} // Tailwind gray-800 chính xác
  >
    {product.name}
  </Link>
</h3>

            {/* Mô tả (không bọc) */}
            <p className="text-gray-600 text-sm">{product.shortDesc}</p>

            {/* Giá (không bọc) */}
            <p className="text-red-600 font-bold mt-2">
              {product.price.toLocaleString()} ₫
            </p>
          </div>
        </div>
      </div>

      {/* Vote, bình luận, chia sẻ (không bọc link) */}
      <div className="ml-4 flex flex-col justify-end">
        <ProductActions productId={product.id} />
      </div>
    </div>
  )
}
