"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-black text-white p-6 sm:p-12 space-y-16">
      {/* Thông báo */}
      <div className="bg-[#f2efff] text-black text-center text-sm py-2 rounded">
        🏆 TITAN FORGED ĐÃ THẮNG CUỘC THI BE QUIET! —{" "}
        <a href="#" className="underline font-medium">
          Xem chi tiết tại đây
        </a>
      </div>

      {/* Phần chính / Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Mua & Bán Thiết Bị Gaming Uy Tín 🎮
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Nền tảng số 1 cho game thủ mua bán PC, GPU và phụ kiện một cách an toàn, nhanh chóng.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            href="/bat-dau-ban"
            className="bg-white text-black rounded-full px-6 py-3 font-semibold hover:bg-gray-200 transition"
          >
            Bắt đầu bán hàng
          </Link>
          <Link
            href="/san-pham"
            className="border border-white rounded-full px-6 py-3 font-semibold hover:bg-white hover:text-black transition"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Danh mục</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "PC Gaming", desc: "Hiệu năng mạnh mẽ, sẵn sàng chiến game." },
            { title: "Card đồ họa (GPU)", desc: "Đa dạng cấu hình cho mọi nhu cầu." },
            { title: "Phụ kiện", desc: "Bàn phím, chuột, tai nghe và nhiều hơn nữa." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1c1c1c] p-6 rounded-lg hover:bg-[#2a2a2a] transition"
            >
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Phần demo giữ nguyên để học tập */}
      <section className="text-center">
        <Image
          className="mx-auto dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="mt-6 font-mono list-inside list-decimal text-sm text-center text-gray-400">
          <li className="mb-2">
            Bắt đầu bằng cách chỉnh sửa{" "}
            <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
          </li>
          <li>Lưu lại và xem thay đổi ngay lập tức.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            className="rounded-full bg-white text-black hover:bg-gray-200 px-5 py-2 flex items-center gap-2 font-semibold"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Triển khai ngay
          </a>
          <a
            className="rounded-full border border-white hover:bg-white hover:text-black px-5 py-2 font-semibold"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem tài liệu
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-12 border-t border-white/10">
        <div className="flex justify-center gap-4 flex-wrap py-4">
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            className="hover:underline flex items-center gap-2"
          >
            <Image src="/file.svg" alt="File" width={16} height={16} />
            Học Next.js
          </a>
          <a
            href="https://vercel.com/templates"
            target="_blank"
            className="hover:underline flex items-center gap-2"
          >
            <Image src="/window.svg" alt="Window" width={16} height={16} />
            Mẫu giao diện
          </a>
          <a
            href="https://nextjs.org"
            target="_blank"
            className="hover:underline flex items-center gap-2"
          >
            <Image src="/globe.svg" alt="Globe" width={16} height={16} />
            Truy cập nextjs.org →
          </a>
        </div>
      </footer>
    </div>
  );
}

