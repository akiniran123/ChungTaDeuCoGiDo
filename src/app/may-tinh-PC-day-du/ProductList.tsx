// ProductList.tsx
"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { Product } from "./types"
import { fmt } from "./utils"

type ProductListProps = { paginated: Product[] }

export default function ProductList({ paginated }: ProductListProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-4">
      {paginated.map((p) => (
        <article key={p.id} onClick={() => router.push(`/products/${p.id}`)} className="flex border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white">
          <div className="w-48 h-36 flex-shrink-0">
            <img src={p.images?.[0] ?? ""} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-lg font-semibold truncate">{p.name}</h3>
            <p className="text-sm text-gray-600 truncate mt-1">{p.description}</p>

            <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4">
              <div><strong>Hãng:</strong> {p.brand}</div>
              <div><strong>CPU:</strong> {p.cpu}</div>
              <div><strong>GPU:</strong> {p.gpu}</div>
              <div><strong>RAM:</strong> {p.ram}</div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="text-xl font-bold text-blue-600">{fmt(p.price)}</div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/products/${p.id}`) }} className="px-3 py-2 border rounded text-sm cursor-pointer">Xem</button>
                <button onClick={(e) => { e.stopPropagation(); alert("Add to cart demo") }} className="px-3 py-2 bg-green-600 text-white rounded text-sm cursor-pointer">Mua</button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
