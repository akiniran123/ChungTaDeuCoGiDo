import { Product } from "./Types"

export const products: Product[] = [
  {
    id: 1,
    type: "gaming",
    brand: "ASUS",
    cpu: "Intel Core i7",
    gpu: "RTX 4070",
    ram: "16GB",
    name: "PC Gaming ASUS RTX 4070",
    price: 35000000,
    description: "Hiệu năng cao, chơi game mượt mà",
    images: [
      "https://images.unsplash.com/photo-1612831455542-2d3e2b9c8b91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612831455645-4b9f9c9e5d32?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 5,
  },
  // ... các sản phẩm khác
]
