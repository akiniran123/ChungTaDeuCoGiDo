"use client"

import Link from "next/link"
import { Product } from "./types"
import ProductActions from "./ProductActions"

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="flex items-start border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-900">
      <Link href={`/may-tinh-PC-day-du/${product.id}`} className="flex-1">
        <h3 className="text-lg font-semibold hover:underline">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {product.brand} - {product.cpu} - {product.gpu} - {product.ram}
        </p>
        <p className="text-red-500 font-bold mt-2">
          {product.price.toLocaleString()} VND
        </p>
      </Link>
      <ProductActions productId={product.id} />
    </div>
  )
}

