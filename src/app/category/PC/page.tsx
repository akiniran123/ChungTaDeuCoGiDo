'use client'

import { useRouter } from 'next/navigation'

export default function PCPage() {
  const router = useRouter()

  // Danh sách sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: 'PC Gaming RTX 4070',
      description: 'Hiệu năng cao, chơi game mượt mà',
      image:
        'https://images.unsplash.com/photo-1610465299993-1c1c7e2e1f3e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'PC Văn phòng Core i5',
      description: 'Tiết kiệm điện, chạy ổn định',
      image:
        'https://images.unsplash.com/photo-1587202372775-9899f1f9c3f4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Workstation thiết kế đồ họa',
      description: 'Phục vụ dựng phim, thiết kế 3D chuyên nghiệp',
      image:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <div className="pt-20 p-6 max-w-screen-xl mx-auto">
      {/* Nút Xây dựng máy tính */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => router.push('/list')}
          aria-label="Start Your Build"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] text-white"
        >
          <span className="mr-2 text-lg">🚀</span>
          <span className="whitespace-nowrap">Xây dựng máy tính</span>
        </button>
      </div>

      {/* Tiêu đề và mô tả */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Danh mục PC</h1>
        <p className="text-gray-600">
          Hiển thị các loại máy tính, linh kiện, PC gaming, PC văn phòng,
          workstation...
        </p>
      </div>

      {/* Khung sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
