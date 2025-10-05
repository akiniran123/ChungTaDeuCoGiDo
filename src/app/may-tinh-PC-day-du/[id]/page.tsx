"use client";

import { useParams } from "next/navigation";
import { products } from "@/app/may-tinh-PC-day-du/data";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [saved, setSaved] = useState(false);

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="pt-24 max-w-5xl mx-auto p-6">
        <p className="text-gray-600">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  const handleSave = () => {
    addToCart({
      ...product,
      image: product.images[0], // dùng ảnh đầu tiên làm đại diện
      quantity: 1,
    });
    setSaved(true);

    // Sau 1.5 giây tự tắt trạng thái "đã lưu"
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="pt-24 max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div className="relative w-full h-80 md:h-[400px]">
        <Image
          src={product.images[0]} // lấy ảnh đầu tiên
          alt={product.name}
          fill
          className="object-contain rounded-lg border"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl text-[#9b4de0] font-semibold">
          {product.price.toLocaleString("vi-VN")} ₫
        </p>

        <ul className="text-gray-700 space-y-1">
          <li>
            <b>Hãng:</b> {product.brand}
          </li>
          <li>
            <b>CPU:</b> {product.cpu}
          </li>
          <li>
            <b>GPU:</b> {product.gpu}
          </li>
          <li>
            <b>RAM:</b> {product.ram} GB
          </li>
          <li>
            <b>Loại:</b> {product.type}
          </li>
        </ul>

        <button
          onClick={handleSave}
          className={`mt-4 px-6 py-3 rounded-lg font-semibold transition ${
            saved
              ? "bg-green-500 text-white"
              : "bg-[#9b4de0] text-white hover:bg-[#7c3cc7]"
          }`}
        >
          {saved ? "✅ Đã lưu vào giỏ hàng" : "Lưu"}
        </button>
      </div>
    </div>
  );
}
