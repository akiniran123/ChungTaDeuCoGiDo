"use client";

import { useCart, CartItem } from "../context/CartContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useState } from "react";

export default function GioHangPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [showQR, setShowQR] = useState(false);

  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Giỏ hàng</h1>
      <p className="mt-2 text-gray-600">Các sản phẩm bạn đã thêm vào giỏ.</p>

      {cart.length === 0 ? (
        <p className="mt-6 text-gray-500">
          Chưa có sản phẩm nào trong giỏ hàng.
        </p>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {cart.map((p: CartItem) => (
              <div key={p.id} className="relative">
                <ProductCard
                  title={p.name}
                  description={`${p.quantity} x ${p.price.toLocaleString()} VND`}
                  image={p.image}
                />
                <button
                  onClick={() => removeFromCart(p.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* Tổng cộng + hành động */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => alert("Thanh toán trực tiếp thành công!")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Thanh toán trực tiếp
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Thanh toán QR
              </button>
            </div>

            <p className="text-xl font-semibold">
              Tổng: {total.toLocaleString()} VND
            </p>
          </div>

          {/* Popup QR */}
          {showQR && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-md relative">
                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-2 right-2 text-gray-500"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4">
                  Quét mã QR để thanh toán
                </h2>
                <img
                  src="/qr-code.png" // 👉 thay ảnh QR code thật của bạn ở đây
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
                <p className="mt-4 text-center font-semibold">
                  Số tiền: {total.toLocaleString()} VND
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
