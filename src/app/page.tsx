"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar cố định */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Nội dung trang chính */}
      <main className="pt-48 px-4 space-y-16">
        {/* Phần Build Your Dream PC lên đầu */}
        <section className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center text-center px-4 bg-gray-50 rounded-lg py-16">
          <h1 className="text-4xl font-bold mb-4">🛠️ Build Your Dream PC</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            Chọn linh kiện phù hợp, theo dõi giá, và chia sẻ cấu hình máy tính của bạn.
          </p>

          <Link
            href="/list"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold !text-white shadow-md transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            🚀 Start Your Build
          </Link>
        </section>

        {/* Phần NexLoot */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Chào mừng bạn đến với NexLoot</h1>
          <p className="text-lg text-gray-600">
            Dẫn đầu đổi mới - Vững bước tương lai
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔥 Sản phẩm Mới</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["1q.webp", "2.webp", "3.webp"].map((filename, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow bg-white"
              >
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm HOT ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0}
                />
                <h3 className="text-lg font-semibold">Sản phẩm A{i + 1}</h3>
                <p className="text-sm text-gray-600">
                  Mô tả ngắn về sản phẩm HOT {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🚀 Sản phẩm Mua Nhiều</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["4.webp", "5.webp", "6.webp"].map((filename, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow bg-white"
              >
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm bán chạy ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0}
                />
                <h3 className="text-lg font-semibold">Sản phẩm B{i + 1}</h3>
                <p className="text-sm text-gray-600">
                  Mô tả ngắn về sản phẩm bán chạy {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💸 Sản phẩm Khuyến Mãi & Giảm Giá</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["7.webp", "8.webp", "9_1.webp"].map((filename, i) => (
              <div
                key={i}
                className="border p-4 rounded shadow bg-white"
              >
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm mua nhiều ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0}
                />
                <h3 className="text-lg font-semibold">Sản phẩm C{i + 1}</h3>
                <p className="text-sm text-gray-600">
                  Mô tả ngắn về sản phẩm mua nhiều {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-16">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-lg">🏢 Thông tin công ty</h4>
            <p>Công ty Cổ phần NexLoot</p>
            <p>Địa chỉ: 19 Vĩnh Hoàng, Quận Hoàng Mai, Hà Nội</p>
            <p>SĐT: 0868576379</p>
            <p>Mã số doanh nghiệp: 0123456789</p>
            <p>Sở Kế hoạch và Đầu tư TP.Hà Nội cấp ngày .../.../2026</p>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-lg">📂 Danh mục</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Đánh giá của khách hàng
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-lg">💳 Thanh toán</h4>
            <ul className="space-y-1">
              <li>Ngân hàng: Vietcombank, Techcombank, BIDV...</li>
              <li>Ví điện tử: Momo, ZaloPay, ShopeePay</li>
              <li>Chuyển khoản trực tiếp hoặc quét mã QR</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
