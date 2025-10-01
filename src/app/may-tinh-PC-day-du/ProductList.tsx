"use client"

import React, { useState } from "react"
import { products as allProducts } from "./data"
import { Product } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import ProductItem from "./ProductItem"

type Props = {
  paginated?: Product[]
  onSelectProduct?: (id: number) => void
}

export default function ProductList({ paginated }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [direction, setDirection] = useState(0)
  const itemsPerPage = 9

  const isExternal = Array.isArray(paginated)
  const paginatedProducts = isExternal
    ? (paginated as Product[])
    : allProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )

  const totalPages = Math.max(1, Math.ceil(allProducts.length / itemsPerPage))

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  }

  const animateKey = isExternal
    ? `external-${paginatedProducts.length}-${paginatedProducts[0]?.id ?? 0}`
    : `internal-${currentPage}`

  if (!paginatedProducts || paginatedProducts.length === 0) {
    return <p className="text-gray-500">Không có sản phẩm nào.</p>
  }

  return (
    <div className="flex flex-col gap-6">
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
            <ProductItem key={p.id} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>

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
