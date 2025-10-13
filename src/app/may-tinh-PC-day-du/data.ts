import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    user_id: "101",
    title: "PC Gaming ASUS RTX 4070",
    category: "PC Gaming",
    is_private: false,
    condition: "new",
    description: "PC gaming ASUS hiệu năng cao, card RTX 4070.",
    specs: {
      CPU: "Intel Core i7-13700K",
      GPU: "NVIDIA RTX 4070",
      RAM: "16GB DDR5",
      Storage: "1TB SSD NVMe",
      Brand: "ASUS",
    },
    images: [
      "https://images.unsplash.com/photo-1612831455542-2d3e2b9c8b91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9b7?auto=format&fit=crop&w=800&q=80",
    ], // ✅ Bỏ stringify
    video_url: null,
    price: 35000000,
    enable_offers: true,
    min_offer: 33000000,
    quantity: 5,
    sku: "ASUS-RTX4070-GAME",
    return_policy: "7 ngày đổi trả nếu lỗi phần cứng.",
    image_url:
      "https://images.unsplash.com/photo-1612831455542-2d3e2b9c8b91?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-10-09T00:00:00Z",
    community_id: null,
    upvotes: 10,
    views: 120,
  },
  {
    id: "2",
    user_id: "102",
    title: "PC Văn Phòng Dell OptiPlex",
    category: "PC Văn Phòng",
    is_private: false,
    condition: "used",
    description: "Máy tính văn phòng Dell OptiPlex nhỏ gọn, tiết kiệm điện.",
    specs: {
      CPU: "Intel Core i5-10400",
      GPU: "Intel UHD Graphics 630",
      RAM: "8GB DDR4",
      Storage: "512GB SSD",
      Brand: "Dell",
    },
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    ], // ✅ Bỏ stringify
    video_url: null,
    price: 9500000,
    enable_offers: false,
    min_offer: null,
    quantity: 12,
    sku: "DELL-OPTIPLEX",
    return_policy: "Không đổi trả sau khi nhận hàng.",
    image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    created_at: "2025-10-09T00:00:00Z",
    community_id: null,
    upvotes: 5,
    views: 80,
  },
];
