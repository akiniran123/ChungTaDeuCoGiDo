"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Eye, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: string
  title: string
  price: number
  qty: number
  image?: string
  sku?: string
}

export default function CartMenu({ initialItems }: { initialItems?: CartItem[] }) {
  const [openCart, setOpenCart] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems || [])
  const cartRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null)
  const router = useRouter()

  // Load cart from localStorage (demo). In production, replace with server-side / context
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('cart_v1') : null
      if (saved) {
        setCartItems(JSON.parse(saved))
        return
      }
    } catch (e) {
      // ignore parse errors
    }

    if (!initialItems) {
      // Demo data – thay bằng state/DB thực tế
      setCartItems([
        { id: 'p1', title: 'CPU Ryzen 7 7800X3D', price: 9_990_000, qty: 1 },
        { id: 'p2', title: 'RAM DDR5 32GB 6000MHz', price: 2_290_000, qty: 2 },
      ])
    }
  }, [initialItems])

  // Persist to localStorage (demo)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('cart_v1', JSON.stringify(cartItems))
    } catch (e) {
      // ignore
    }
  }, [cartItems])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cartItems]
  )

  // Business rules (tune these values to your store)
  const shippingFreeThreshold = 2_000_000 // miễn phí vận chuyển nếu >= 2 triệu
  const shippingFee = cartTotal === 0 ? 0 : cartTotal >= shippingFreeThreshold ? 0 : 30_000
  const taxRate = 0.1
  const tax = Math.round(cartTotal * taxRate)
  const grandTotal = cartTotal + shippingFee + tax

  const formatCurrency = (v: number) => v.toLocaleString('vi-VN') + '₫'

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setOpenCart(false)
      }
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenCart(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [])

  // Focus management: focus first action when opening, return focus to button when closing
  useEffect(() => {
    if (openCart) {
      setTimeout(() => firstFocusableRef.current?.focus(), 0)
    } else {
      buttonRef.current?.focus()
    }
  }, [openCart])

  function updateQty(id: string, delta: number) {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)))
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <div className="relative" ref={cartRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpenCart((v) => !v)}
        aria-label="Giỏ hàng"
        aria-expanded={openCart}
        className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b4de0] p-1 rounded"
      >
        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[#9b4de0]" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {cartItems.length}
          </span>
        )}
      </button>

      {openCart && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50" role="dialog" aria-label="Giỏ hàng của bạn">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Giỏ hàng
              <span className="text-xs text-gray-500 font-normal ml-1">({cartItems.length} sản phẩm)</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCart}
                disabled={cartItems.length === 0}
                className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 inline-block mr-1" /> Xóa tất cả
              </button>
              <button onClick={() => setOpenCart(false)} aria-label="Đóng" className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <ul className="max-h-80 overflow-auto divide-y" role="list">
            {cartItems.length === 0 ? (
              <li className="p-6 text-sm text-gray-500 text-center">Giỏ hàng trống. Thêm sản phẩm vào giỏ để tiếp tục.</li>
            ) : (
              cartItems.map((it) => (
                <li key={it.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                      {it.image ? (
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        it.title
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{it.title}</p>
                      <p className="text-xs text-gray-500">SKU: {it.id}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => updateQty(it.id, -1)} className="w-7 h-7 inline-flex items-center justify-center rounded-full border text-sm cursor-pointer" aria-label={`Giảm số lượng ${it.title}`}>
                          <Minus className="w-3 h-3" />
                        </button>

                        <div className="text-sm px-2">{it.qty}</div>

                        <button onClick={() => updateQty(it.id, 1)} className="w-7 h-7 inline-flex items-center justify-center rounded-full border text-sm cursor-pointer" aria-label={`Tăng số lượng ${it.title}`}>
                          <Plus className="w-3 h-3" />
                        </button>

                        <button onClick={() => removeItem(it.id)} className="ml-2 text-xs text-gray-500 hover:text-red-600 cursor-pointer flex items-center gap-1" aria-label={`Xóa ${it.title}`}>
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold shrink-0">{formatCurrency(it.price * it.qty)}</div>
                </li>
              ))
            )}
          </ul>

          {cartItems.length > 0 && (
            <div className="px-4 py-3 border-t">
              <div className="text-sm mb-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Thuế (VAT 10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between font-semibold mt-2">
                  <span>Tổng</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button ref={firstFocusableRef} onClick={() => router.push('/gio-hang')} className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-200 text-sm px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" /> Xem giỏ hàng
                </button>

                <button onClick={() => router.push('/checkout')} disabled={cartItems.length === 0} className="flex-1 inline-flex items-center justify-center rounded-full bg-[#9b4de0] text-white text-sm px-4 py-2 hover:bg-[#873ac7] disabled:opacity-50 cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" /> Thanh toán
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">Giao dịch an toàn • Bảo mật thanh toán</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
