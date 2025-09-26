"use client"

import React, { useState } from "react"
import { products as allProducts } from "./data"
import { Product } from "./types"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  paginated?: Product[] // nếu page.tsx truyền paginated, component sẽ render mảng này
}

export default function ProductList({ paginated }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [direction, setDirection] = useState(0) // 1 = next, -1 = prev
  const itemsPerPage = 9

  const isExternal = Array.isArray(paginated) // liệu danh sách được cung cấp từ ngoài chưa
  // nếu có paginated thì render paginated, nếu không thì slice từ allProducts theo currentPage
  const paginatedProducts = isExternal
    ? (paginated as Product[])
    : allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.max(1, Math.ceil(allProducts.length / itemsPerPage))

  // animation variants (dùng custom để biết hướng)
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  }

  // key để animate khi đổi trang hoặc khi paginated từ ngoài thay đổi
  const animateKey = isExternal
    ? `external-${paginatedProducts.length}-${paginatedProducts[0]?.id ?? 0}`
    : `internal-${currentPage}`

  // Nếu không có sản phẩm nào
  if (!paginatedProducts || paginatedProducts.length === 0) {
    return <p className="text-gray-500">Không có sản phẩm nào.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Danh sách sản phẩm */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={animateKey}
          variants={variants}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-4"
        >
          {paginatedProducts.map((p: Product) => (
            <div
              key={p.id}
              className="flex items-center border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Ảnh */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={p.images?.[0] ?? ""}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Thông tin */}
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand}</p>
                <p className="text-sm text-gray-600">
                  {p.cpu} / {p.gpu}
                </p>
                <p className="text-sm text-gray-600">{p.ram} RAM</p>
                <p className="font-bold text-blue-600 mt-2">
                  {p.price.toLocaleString()} ₫
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Nếu paginated được truyền từ ngoài, page controls sẽ nằm ở ngoài (page.tsx) => không hiển thị nội bộ.
          Nếu không có paginated (component tự quản trang), hiển thị controls tại đây. */}
      {!isExternal && (
        <div className="flex justify-center gap-2 mt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setDirection(-1)
              setCurrentPage((p) => Math.max(1, p - 1))
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setDirection(1)
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  )
}
