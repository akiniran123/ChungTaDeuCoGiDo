"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { products } from "@/app/may-tinh-PC-day-du/data";
import { normalizeProducts } from "@/utils/normalizeProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [saved, setSaved] = useState(false);

  // ✅ Chuẩn hóa dữ liệu
  const normalized = normalizeProducts(products);
  const product = normalized.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="pt-24 max-w-5xl mx-auto p-6">
        <p className="text-gray-600">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png"; // fallback

  const price =
    typeof product.price === "number"
      ? product.price
      : parseFloat(product.price || "0");

  const handleSave = () => {
    addToCart({
      id: product.id,
      name: product.title, // ✅ CartItem yêu cầu "name"
      image: firstImage,
      price: price,
      quantity: 1,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="pt-24 max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div className="relative w-full h-80 md:h-[400px]">
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain rounded-lg border"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-xl text-[#9b4de0] font-semibold">
          {price.toLocaleString("vi-VN")} ₫
        </p>

        <ul className="text-gray-700 space-y-1">
          <li>
            <b>Hãng:</b> {product.brand || "—"}
          </li>
          <li>
            <b>CPU:</b> {product.cpu || "—"}
          </li>
          <li>
            <b>GPU:</b> {product.gpu || "—"}
          </li>
          <li>
            <b>RAM:</b> {product.ram || "—"}
          </li>
          <li>
            <b>Loại:</b> {product.type || "—"}
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
