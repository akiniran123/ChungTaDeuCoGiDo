'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartMenu() {
  interface CartItem {
    id: string
    title: string
    price: number
    qty: number
  }

  const [openCart, setOpenCart] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const cartRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Demo data – thay bằng state/DB thực tế
    setCartItems([
      { id: 'p1', title: 'CPU Ryzen 7 7800X3D', price: 9_990_000, qty: 1 },
      { id: 'p2', title: 'RAM DDR5 32GB 6000MHz', price: 2_290_000, qty: 2 },
    ])
  }, [])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cartItems]
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setOpenCart(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={cartRef}>
      <button
        type="button"
        className="relative"
        onClick={() => setOpenCart(v => !v)}
        aria-label="Giỏ hàng"
      >
        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[#9b4de0]" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {cartItems.length}
          </span>
        )}
      </button>

      {openCart && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="text-sm font-semibold">Giỏ hàng</span>
            <button
              className="text-xs text-[#9b4de0] hover:underline"
              onClick={() => router.push('/gio-hang')}
            >
              Xem giỏ hàng
            </button>
          </div>

          <ul className="max-h-80 overflow-auto divide-y">
            {cartItems.length === 0 ? (
              <li className="p-4 text-sm text-gray-500">Giỏ hàng trống.</li>
            ) : (
              cartItems.map((it) => (
                <li key={it.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{it.title}</p>
                    <p className="text-xs text-gray-500">Số lượng: x{it.qty}</p>
                  </div>
                  <div className="text-sm font-semibold shrink-0">
                    {(it.price * it.qty).toLocaleString('vi-VN')}₫
                  </div>
                </li>
              ))
            )}
          </ul>

          {cartItems.length > 0 && (
            <div className="px-4 py-3 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Tổng</span>
                <span className="font-semibold">{cartTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/gio-hang')}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-[#9b4de0] text-white text-sm px-4 py-2 hover:bg-[#873ac7] transition"
                >
                  Xem giỏ hàng
                </button>
                {/* Nếu đã có checkout, mở nút bên dưới */}
                {/* <button
                  onClick={() => router.push('/checkout')}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700 transition"
                >
                  Thanh toán
                </button> */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
