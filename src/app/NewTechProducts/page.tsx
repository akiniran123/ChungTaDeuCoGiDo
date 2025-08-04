"use client";

import Image from "next/image";
import { Cpu, Smartphone, Tv2, Headphones } from "lucide-react";

export default function NewTechProductsPage() {
  const products = [
    {
      name: "iPhone 15 Pro Max 256GB",
      description: "Màn hình Super Retina XDR, chip A17 Pro, khung titanium cực nhẹ.",
      price: "32.990.000₫",
      icon: <Smartphone className="w-5 h-5 text-blue-500" />,
      image: "/assets/products/iphone15pro.jpg",
    },
    {
      name: 'MacBook Pro 14" M3 Pro 2024',
      description: "Hiệu năng đỉnh cao với chip M3 Pro, màn hình Liquid Retina XDR.",
      price: "52.990.000₫",
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      image: "/assets/products/macbookm3.jpg",
    },
    {
      name: 'Smart TV Samsung QLED 65"',
      description: "Công nghệ hiển thị Quantum Dot, thiết kế tràn viền sang trọng.",
      price: "21.490.000₫",
      icon: <Tv2 className="w-5 h-5 text-orange-500" />,
      image: "/assets/products/samsungtv.jpg",
    },
    {
      name: "Tai nghe Sony WH-1000XM5",
      description: "Chống ồn chủ động hàng đầu, thời lượng pin 30 giờ.",
      price: "7.890.000₫",
      icon: <Headphones className="w-5 h-5 text-emerald-600" />,
      image: "/assets/products/sonyheadphones.jpg",
    },
    {
      name: "iPad Pro M4 12.9” 2024",
      description: "Màn hình OLED cực đẹp, chip M4 mạnh mẽ, hỗ trợ Apple Pencil Pro.",
      price: "38.990.000₫",
      icon: <Smartphone className="w-5 h-5 text-pink-500" />,
      image: "/assets/products/ipadpro2024.jpg",
    },
    {
      name: "Loa Bluetooth JBL Charge 5",
      description: "Âm thanh mạnh mẽ, chống nước IP67, pin dùng 20 giờ.",
      price: "3.290.000₫",
      icon: <Headphones className="w-5 h-5 text-yellow-600" />,
      image: "/assets/products/jblcharge5.jpg",
    },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {products.map((product, index) => (
          <div key={index} className="flex gap-6 items-start">
            <Image
              src={product.image}
              alt={product.name}
              width={140}
              height={140}
              className="rounded-xl object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {product.icon}
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                {product.description}
              </p>
              <p className="text-lg font-bold text-red-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
