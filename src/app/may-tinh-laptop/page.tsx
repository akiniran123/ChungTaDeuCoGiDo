"use client"

import { useState } from "react"
import Link from "next/link"

type Laptop = {
  id: number
  name: string
  brand: string
  price: number
  image: string
  cpu: string
  gpu: string
  ram: string
}

const laptops: Laptop[] = [
  {
    id: 1,
    name: "Dell XPS 15 9530 (2024)",
    brand: "Dell",
    price: 45990000,
    image:
      "https://cdn.tgdd.vn/Products/Images/44/306741/dell-xps-15-9530-2024.jpg",
    cpu: "Intel Core i7-13700H",
    gpu: "RTX 4060",
    ram: "16GB",
  },
  {
    id: 2,
    name: "Asus ROG Zephyrus G14 (2024)",
    brand: "Asus",
    price: 38990000,
    image:
      "https://cdn.tgdd.vn/Products/Images/44/306740/asus-rog-zephyrus-g14.jpg",
    cpu: "AMD Ryzen 9 7940HS",
    gpu: "RTX 4070",
    ram: "16GB",
  },
  {
    id: 3,
    name: "MacBook Pro 16 M3 Max (2024)",
    brand: "Apple",
    price: 79990000,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310",
    cpu: "Apple M3 Max",
    gpu: "GPU 40-core",
    ram: "32GB",
  },
]

export default function BuildLaptopPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("All")

  // Lọc theo brand
  const filteredLaptops =
    selectedBrand === "All"
      ? laptops
      : laptops.filter((l) => l.brand === selectedBrand)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar bộ lọc */}
      <aside className="lg:col-span-1 border rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Thương hiệu</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="All">Tất cả</option>
            <option value="Dell">Dell</option>
            <option value="Asus">Asus</option>
            <option value="Apple">Apple</option>
          </select>
        </div>
      </aside>

      {/* Danh sách sản phẩm */}
      <section className="lg:col-span-3 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Laptop dành cho bạn</h1>

        {filteredLaptops.map((laptop) => (
          <div
            key={laptop.id}
            className="flex flex-col md:flex-row items-center md:items-start border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            {/* Ảnh */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={laptop.image}
                alt={laptop.name}
                className="max-h-[180px] object-contain rounded-lg"
              />
            </div>

            {/* Thông tin */}
            <div className="md:ml-6 flex-1 text-center md:text-left mt-4 md:mt-0">
              <h2 className="text-xl font-semibold">{laptop.name}</h2>
              <p className="text-gray-600">
                CPU: {laptop.cpu} | GPU: {laptop.gpu} | RAM: {laptop.ram}
              </p>
              <div className="text-blue-600 font-bold text-lg mt-2">
                {laptop.price.toLocaleString("vi-VN")}₫
              </div>

              {/* Nút */}
              <div className="mt-3 flex gap-3 justify-center md:justify-start">
                <Link
                  href={`/xay-dung-laptop/${laptop.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </Link>
                <Link
                  href="/cart"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  ➕ Giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
