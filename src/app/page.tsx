"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navbar cố định */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Nội dung trang chính */}
      <main className="pt-48 px-4 space-y-16">
        {/* Tiêu đề công ty */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Chào mừng bạn đến với NexLoot</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Dẫn đầu đổi mới - Vững bước tương lai
          </p>
        </header>

        {/* Sản phẩm HOT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔥 Sản phẩm HOT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["1q.webp", "2.webp", "3.webp"].map((filename, i) => (
              <div key={i} className="border p-4 rounded shadow bg-white dark:bg-gray-900">
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm HOT ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0} // Chỉ ảnh đầu tiên load sớm
                />
                <h3 className="text-lg font-semibold">Sản phẩm A{i + 1}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mô tả ngắn về sản phẩm HOT {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sản phẩm bán chạy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🚀 Sản phẩm bán chạy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["4.webp", "5.webp", "6.webp"].map((filename, i) => (
              <div key={i} className="border p-4 rounded shadow bg-white dark:bg-gray-900">
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm bán chạy ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0} // Ưu tiên ảnh đầu của nhóm
                />
                <h3 className="text-lg font-semibold">Sản phẩm B{i + 1}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mô tả ngắn về sản phẩm bán chạy {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sản phẩm mua nhiều */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💸 Sản phẩm mua nhiều</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["7.webp", "8.webp", "9_1.webp"].map((filename, i) => (
              <div key={i} className="border p-4 rounded shadow bg-white dark:bg-gray-900">
                <Image
                  src={`/assets/products/${filename}`}
                  alt={`Sản phẩm mua nhiều ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded mb-2 w-full object-cover h-48"
                  priority={i === 0} // Ưu tiên ảnh đầu tiên
                />
                <h3 className="text-lg font-semibold">Sản phẩm C{i + 1}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mô tả ngắn về sản phẩm mua nhiều {i + 1}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tầm nhìn và chiến lược của cổ đông */}
        <section className="py-12 px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-left">
            🧭 Tầm nhìn & Chiến lược của cổ đông
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold">🧑‍💼 Nguyễn Tuấn Nghĩa</h3>
              <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                NexLoot cam kết không ngừng đổi mới, đặt khách hàng và cộng đồng lên hàng đầu.
                Tầm nhìn của chúng tôi là trở thành công ty công nghệ hàng đầu Đông Nam Á trong 10 năm tới,
                đồng hành cùng sự phát triển bền vững và ứng dụng công nghệ vào cuộc sống.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">
                — Chủ sở hữu & Đồng sáng lập, công ty NexLoot
              </p>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold">🧑‍💼 Trần Đức Anh</h3>
              <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                Chiến lược dài hạn của chúng tôi là xây dựng hệ sinh thái số hiện đại,
                lấy công nghệ làm nền tảng, đội ngũ nhân sự là cốt lõi, hướng đến hội nhập quốc tế,
                minh bạch tài chính và nâng cao trải nghiệm người dùng toàn diện.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">
                — Chủ sở hữu & Đồng sáng lập, công ty NexLoot
              </p>
            </div>
          </div>
        </section>

        {/* Footer mở rộng */}
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
              <li><a href="#" className="hover:underline">Về chúng tôi</a></li>
              <li><a href="#" className="hover:underline">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:underline">Tuyển dụng</a></li>
              <li><a href="#" className="hover:underline">Liên hệ</a></li>
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
