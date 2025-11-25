"use client";

import { useState } from "react";
import { useCart, CartItem } from "../context/CartContext";
import ProductCard from "@/components/ProductCard/pc/ProductCard";

// Giả lập thông tin người bán (demo)
const sellersInfo: Record<
  string,
  { name: string; phone: string; email: string }
> = {
  "product-1": { name: "Nguyễn Văn A", phone: "0123456789", email: "a@example.com" },
  "product-2": { name: "Trần Thị B", phone: "0987654321", email: "b@example.com" },
};

export default function GioHangPage() {
  const { cart, clearCart } = useCart();
  const [showSeller, setShowSeller] = useState<string | null>(null);

  const handleContactSeller = (id: string, productName: string) => {
    const info = sellersInfo[id];
    if (!info) return;

    setShowSeller(id);
    alert(
      `✅ Thông báo: Người mua quan tâm sản phẩm "${productName}".\nNgười bán: ${info.name} sẽ liên hệ!`
    );
  };

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
                {/* ✅ Sửa lại cách truyền prop cho ProductCard */}
                <ProductCard
                  product={{
                    id: p.id.toString(),
                    title: p.name,
                    price: p.price,
                    images: [p.image],
                    description: `${p.quantity} x ${p.price.toLocaleString()} VND`,
                    category: null,
                  }}
                />

                {/* Nút xem thông tin người bán */}
                <button
                  onClick={() => handleContactSeller(p.id.toString(), p.name)}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Thông tin liên hệ
                </button>

                {showSeller === p.id.toString() && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <p>Người bán: {sellersInfo[p.id.toString()].name}</p>
                    <p>Điện thoại: {sellersInfo[p.id.toString()].phone}</p>
                    <p>Email: {sellersInfo[p.id.toString()].email}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tổng tiền & nút xóa */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Xóa tất cả
            </button>

            <p className="text-xl font-semibold">
              Tổng:{" "}
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}{" "}
              VND
            </p>
          </div>
        </>
      )}
    </div>
  );
}
