'use client'

import { useRouter } from 'next/navigation'

export default function PCPage() {
  const router = useRouter()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">PC</h1>
      <p className="mb-6">
        Đây là trang danh mục <strong>PC</strong>.  
        Bạn có thể hiển thị các loại máy tính, linh kiện, PC gaming, PC văn phòng, workstation ở đây.
      </p>

      {/* Nút Xây dựng máy tính */}
      <button
        onClick={() => router.push('/list')}
        aria-label="Start Your Build"
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] text-white"
      >
        <span className="mr-2 text-lg">🚀</span>
        <span className="whitespace-nowrap">Xây dựng máy tính</span>
      </button>
    </div>
  )
}
