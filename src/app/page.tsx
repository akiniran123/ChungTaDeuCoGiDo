"use client";

import React, { useState } from "react";
import Link from "next/link";

function ToggleFooterSection({
  title,
  items,
  className = "",
}: {
  title: string;
  items: { label: string; href: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`space-y-1 text-right min-w-0 ${className}`}>
      <button
        className="font-semibold mb-2 w-full text-right hover:text-pink-600 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`footer-section-${title.replace(/\s+/g, "")}`}
      >
        {title}
      </button>
      {open && (
        <div
          id={`footer-section-${title.replace(/\s+/g, "")}`}
          className="flex flex-col gap-1 pr-2 break-words max-w-full"
        >
          {items.map(({ label, href }, i) => {
            const isExternal = href.startsWith("http") || href.startsWith("mailto:");
            if (isExternal) {
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-500 transition-colors text-sm text-right break-words"
                >
                  {label}
                </a>
              );
            }
            return (
              <Link
                key={i}
                href={href}
                className="text-gray-600 hover:text-pink-500 transition-colors text-sm text-right break-words"
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatVND(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₫";
}

const categories = [
  "Tất cả",
  "Công nghệ",
  "Nhà cửa",
  "Thời trang",
  "Thực phẩm",
  "Du lịch",
  "Mã giảm giá",
];

const fixedVotes = [120, 85, 95, 110, 70, 60, 130, 140, 100, 90, 115, 125];
const fixedComments = [15, 8, 12, 6, 20, 5, 10, 9, 7, 4, 3, 2];
const fixedHotness = [500, 480, 520, 510, 470, 460, 530, 540, 550, 560, 570, 580];

const exchangeRate = 30000;

const productNames = [
  "Điện thoại thông minh",
  "Máy tính xách tay",
  "Tai nghe không dây",
  "Máy ảnh kỹ thuật số",
  "Bàn phím cơ",
  "Chuột chơi game",
  "Tivi 4K",
  "Loa Bluetooth",
  "Đồng hồ thông minh",
  "Máy lọc không khí",
  "Nồi chiên không dầu",
  "Máy pha cà phê",
];

const sellers = [
  "Người bán Demo 1",
  "Người bán Demo 2",
  "Người bán Demo 3",
  "Người bán Demo 4",
  "Người bán Demo 5",
  "Người bán Demo 6",
  "Người bán Demo 7",
  "Người bán Demo 8",
  "Người bán Demo 9",
  "Người bán Demo 10",
  "Người bán Demo 11",
  "Người bán Demo 12",
];

export const sampleDeals = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `🔥 Ưu đãi #${i + 1} — Giảm giá ${productNames[i]}`,
  price: formatVND((10 + i * 2) * exchangeRate),
  store: ["Amazon", "Currys", "Argos"][i % 3],
  image: `https://picsum.photos/seed/hukd${i}/500/300`,
  votes: fixedVotes[i],
  comments: fixedComments[i],
  hotness: fixedHotness[i],
  category: categories[1 + (i % (categories.length - 1))],
  seller: sellers[i],
}));

export default function HotDealsHomePage() {
  const [deals, setDeals] = useState(sampleDeals);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  function vote(id: number, delta: number) {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, votes: d.votes + delta } : d))
    );
  }

  const filtered = deals.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  const footerSections = [
    {
      title: "Liên hệ với chúng tôi",
      items: [
        { label: "19 Vĩnh Hoàng, Quận Hoàng Mai, Hà Nội", href: "#" },
        { label: "Mã số doanh nghiệp: 0123456789", href: "#" },
        { label: "SĐT: 0868576379", href: "#" },
        { label: "Email: contact@nexloot.vn", href: "mailto:contact@nexloot.vn" },
        { label: "Facebook: fb.com/nexloot", href: "https://fb.com/nexloot" },
      ],
    },
    {
      title: "Chính sách quyền riêng tư",
      items: [
        { label: "Chính sách bảo mật thông tin", href: "/privacy-policy" },
        { label: "Chính sách đổi trả hàng", href: "/return-policy" },
        { label: "Chính sách giao hàng", href: "/shipping-policy" },
      ],
    },
    {
      title: "Điều khoản & Quy định",
      items: [
        { label: "Điều khoản sử dụng", href: "/terms-of-use" },
        { label: "Quy định cộng đồng", href: "/community-rules" },
        { label: "Quy định đăng tin", href: "/posting-rules" },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { label: "Hỗ trợ khách hàng", href: "/customer-support" },
        { label: "Trung tâm trợ giúp", href: "/help-center" },
        { label: "Liên hệ hỗ trợ", href: "/contact-support" },
        { label: "Hướng dẫn sử dụng", href: "/user-guide" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 text-gray-900">
      {/* HEADER */}
      <header className="border-b bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 fixed w-full top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="text-2xl font-extrabold text-white cursor-pointer drop-shadow-md">
            🔥 HukdClone
          </div>
          <input
            aria-label="Tìm kiếm ưu đãi"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow"
            placeholder="Tìm kiếm ưu đãi, sản phẩm, mã giảm giá..."
          />
          <nav className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white text-pink-600 font-semibold hover:bg-pink-100 transition-colors shadow-md">
              Đăng ưu đãi
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-md">
              Đăng nhập
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-6 pt-28 space-y-4">
        {/* Thanh lọc */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-pink-600">🔥 Ưu đãi nổi bật</h2>
            <p className="text-sm text-gray-500">
              Ưu đãi được cộng đồng bình chọn — sắp xếp theo mức độ hot.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Lọc:</label>
            <select
              className="border rounded px-2 py-1 bg-white shadow-sm"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "hot")
                  setDeals((d) => [...d].sort((a, b) => b.hotness - a.hotness));
                if (val === "new")
                  setDeals((d) => [...d].sort((a, b) => b.id - a.id));
                if (val === "votes")
                  setDeals((d) => [...d].sort((a, b) => b.votes - a.votes));
              }}
            >
              <option value="hot">Mua nhiều nhất</option>
              <option value="votes">Nhiều người thích nhất</option>
              <option value="new">Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Danh sách ưu đãi */}
        <div className="space-y-4">
          {shown.map((deal) => (
            <article
              key={deal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col sm:flex-row border border-pink-100"
            >
              <div className="sm:w-64 flex-shrink-0 relative">
                <Link href={`/product/${deal.id}`} className="block">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="object-cover w-full h-full"
                  />
                </Link>
                {/* Category badge góc trên phải */}
                <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold rounded px-2 py-0.5 select-none">
                  {deal.category}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <Link href={`/product/${deal.id}`} className="no-underline">
                    <h3 className="font-semibold text-lg hover:text-pink-500 transition-colors cursor-pointer">
                      {deal.title}
                    </h3>
                  </Link>
                  {/* Dòng icon + tên người bán dưới tiêu đề */}
                  <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                    {/* Icon user */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.03 0 3.96.485 5.637 1.342M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{deal.seller}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {deal.store} • {deal.category}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => vote(deal.id, 1)}
                      className="px-2 py-1 border rounded hover:bg-green-50 text-green-600 transition-colors"
                      aria-label={`Vote up for ${deal.title}`}
                    >
                      ▲
                    </button>
                    <div className="text-sm font-bold text-gray-700">
                      {deal.votes}
                    </div>
                    <button
                      onClick={() => vote(deal.id, -1)}
                      className="px-2 py-1 border rounded hover:bg-red-50 text-red-600 transition-colors"
                      aria-label={`Vote down for ${deal.title}`}
                    >
                      ▼
                    </button>
                    <span className="text-xs text-orange-500 font-semibold">
                      {deal.hotness}°
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-pink-600">{deal.price}</div>
                    <div className="text-xs text-gray-500">{deal.comments} bình luận</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Hiển thị {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} trong tổng {filtered.length} ưu đãi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded hover:bg-pink-50 transition-colors"
              aria-label="Trang trước"
            >
              Trước
            </button>
            <div className="px-3 py-1 border rounded bg-white shadow-sm" aria-live="polite">
              {page} / {pages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1 border rounded hover:bg-pink-50 transition-colors"
              aria-label="Trang sau"
            >
              Sau
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 border-t border-gray-300 mt-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
          {footerSections.map(({ title, items }, idx) => (
            <ToggleFooterSection
              key={idx}
              title={title}
              items={items}
              className={title === "Hỗ trợ" ? "max-w-[200px]" : ""}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
