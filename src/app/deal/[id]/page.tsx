"use client";

import { useParams } from "next/navigation";

export default function DealDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Chi tiết Deal #{id}
        </h1>

        {/* Nội dung mô tả deal */}
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Đây là trang hiển thị thông tin chi tiết về deal có ID <b>{id}</b>.
          Bạn có thể lấy dữ liệu từ API hoặc database để render ở đây.
        </p>

        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            🔹 Giá: <span className="font-semibold">1.000.000₫</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            🔹 Mô tả: Sản phẩm chất lượng cao, bảo hành 12 tháng.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            🔹 Tình trạng: Còn hàng.
          </p>
        </div>

        <button className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
          Mua ngay
        </button>
      </div>
    </div>
  );
}
