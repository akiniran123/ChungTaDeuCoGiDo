"use client";

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
          <h1 className="text-4xl font-bold">Công ty Cổ phần ABC</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Dẫn đầu đổi mới - Vững bước tương lai
          </p>
        </header>

        {/* Sản phẩm ưu tiên */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔥 Sản phẩm HOT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow">Sản phẩm A</div>
            <div className="border p-4 rounded shadow">Sản phẩm B</div>
            <div className="border p-4 rounded shadow">Sản phẩm C</div>
          </div>
        </section>

        {/* Sản phẩm bán chạy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🚀 Sản phẩm bán chạy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow">Sản phẩm D</div>
            <div className="border p-4 rounded shadow">Sản phẩm E</div>
            <div className="border p-4 rounded shadow">Sản phẩm F</div>
          </div>
        </section>

        {/* Sản phẩm mua nhiều */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💸 Sản phẩm mua nhiều</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow">Sản phẩm G</div>
            <div className="border p-4 rounded shadow">Sản phẩm H</div>
            <div className="border p-4 rounded shadow">Sản phẩm I</div>
          </div>
        </section>

        {/* Tầm nhìn chiến lược */}
        <section className="overflow-x-auto whitespace-nowrap py-12">
          <div className="flex space-x-8 animate-scroll-left px-4">
            <div className="min-w-[300px] max-w-sm border p-4 rounded shadow bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold">🧑‍💼 CEO Nguyễn Văn A</h3>
              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                Với tầm nhìn chiến lược và sự kiên định, chúng tôi không chỉ cung cấp sản phẩm chất lượng mà còn tạo ra giá trị lâu dài cho cộng đồng và cổ đông.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">- Công ty Cổ phần ABC</p>
            </div>
            <div className="min-w-[300px] max-w-sm border p-4 rounded shadow bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold">🧑‍💼 Chủ tịch Trần B</h3>
              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                Chúng tôi luôn đặt sự đổi mới công nghệ lên hàng đầu và hướng đến phát triển bền vững trong mọi hoạt động kinh doanh.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">- Công ty Cổ phần ABC</p>
            </div>
          </div>
        </section>

        {/* Footer mở rộng */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-16">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-lg">🏢 Thông tin công ty</h4>
            <p>Công ty Cổ phần ABC</p>
            <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
            <p>SĐT: 0123 456 789</p>
            <p>Mã số doanh nghiệp: 0123456789</p>
            <p>Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 01/01/2020</p>
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
