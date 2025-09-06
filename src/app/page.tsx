"use client";

import React, { useState } from "react";
import Link from "next/link";

// ToggleFooterSection giữ nguyên
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
      >
        {title}
      </button>
      {open && (
        <div className="flex flex-col gap-1 pr-2 break-words max-w-full">
          {items.map(({ label, href }, i) => {
            const isExternal =
              href.startsWith("http") || href.startsWith("mailto:");
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

// ✅ Sửa categories thành dạng có label + href
const categories = [
  { label: "PC", href: "/category/PC" },
  { label: "Công nghệ", href: "/category/cong-nghe" },
  { label: "Nhà cửa", href: "/category/nha-cua" },
  { label: "Thời trang", href: "/category/thoi-trang" },
  { label: "Thực phẩm", href: "/category/thuc-pham" },
  { label: "Du lịch", href: "/category/du-lich" },
  { label: "Mã giảm giá", href: "/category/ma-giam-gia" },
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
  category: categories[1 + (i % (categories.length - 1))].label,
  seller: sellers[i],
}));

type Comment = {
  id: number;
  user: string;
  text: string;
};

const communityMembers = [
  { id: 1, name: "Thành viên A", followers: 1200, stars: 4.8 },
  { id: 2, name: "Thành viên B", followers: 950, stars: 4.6 },
  { id: 3, name: "Thành viên C", followers: 800, stars: 4.5 },
  { id: 4, name: "Thành viên D", followers: 600, stars: 4.2 },
  { id: 5, name: "Thành viên E", followers: 500, stars: 4.0 },
];

export default function HotDealsHomePage() {
  const [deals, setDeals] = useState(sampleDeals);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({
    1: [
      { id: 1, user: "Nam", text: "Giá tốt quá!" },
      { id: 2, user: "Huy", text: "Mình mới mua, chạy ngon." },
    ],
  });
  const [newComment, setNewComment] = useState("");

  function vote(id: number, delta: number) {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, votes: d.votes + delta } : d))
    );
  }

  function handleAddComment() {
    if (!selectedDeal || !newComment.trim()) return;
    const newCmt: Comment = {
      id: Date.now(),
      user: "Bạn",
      text: newComment,
    };
    setComments((prev) => ({
      ...prev,
      [selectedDeal]: [...(prev[selectedDeal] || []), newCmt],
    }));
    setNewComment("");
  }

  const filtered = deals.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 text-gray-900 flex flex-col">
      {/* HEADER giữ nguyên */}
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
            placeholder="Tìm kiếm ưu đãi..."
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full px-4 py-6 pt-28 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar trái - ✅ sửa chỗ này */}
        <aside className="md:col-span-1 bg-white rounded-r-xl shadow-md p-4 h-fit sticky top-28">
          <h3 className="font-bold text-lg mb-3 text-pink-600">Danh mục</h3>
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i}>
                <Link
                  href={cat.href}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Danh sách ưu đãi giữ nguyên */}
        <section className="md:col-span-3 space-y-4">
          {shown.map((deal) => (
            <article
              key={deal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col sm:flex-row border border-pink-100"
            >
              <Link
                href={`/deal/${deal.id}`}
                className="sm:w-64 flex-shrink-0 relative block"
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold rounded px-2 py-0.5">
                  {deal.category}
                </div>
              </Link>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <Link href={`/deal/${deal.id}`}>
                  <h3 className="font-semibold text-lg hover:text-pink-500 transition-colors cursor-pointer">
                    {deal.title}
                  </h3>
                </Link>
                <div className="text-sm text-gray-500">{deal.store}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => vote(deal.id, 1)}
                      className="px-2 py-1 border rounded hover:bg-green-50 text-green-600"
                    >
                      ▲
                    </button>
                    <div className="text-sm font-bold">{deal.votes}</div>
                    <button
                      onClick={() => vote(deal.id, -1)}
                      className="px-2 py-1 border rounded hover:bg-red-50 text-red-600"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => setSelectedDeal(deal.id)}
                      className="px-2 py-1 border rounded hover:bg-blue-50 text-blue-600 flex items-center gap-1"
                    >
                      💬 <span className="text-xs">{deal.comments}</span>
                    </button>
                    <button
                      onClick={() => {
                        const url = window.location.href + "#deal-" + deal.id;
                        if (navigator.share) {
                          navigator.share({ title: deal.title, url });
                        } else {
                          navigator.clipboard.writeText(url);
                          alert("Đã copy link: " + url);
                        }
                      }}
                      className="px-2 py-1 border rounded hover:bg-gray-50 text-gray-600"
                    >
                      🔗
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-pink-600">
                      {deal.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      {deal.comments} bình luận
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Sidebar phải giữ nguyên */}
        <aside className="md:col-span-1 bg-white rounded-l-xl shadow-md p-4 h-fit sticky top-28">
          <h3 className="font-bold text-lg mb-3 text-pink-600">
            Cộng đồng nổi bật
          </h3>
          <ul className="space-y-3">
            {communityMembers.map((member) => (
              <li
                key={member.id}
                className="flex flex-col gap-1 border-b pb-2 last:border-none"
              >
                <Link
                  href={`/user/${member.id}`}
                  className="font-semibold text-gray-800 hover:text-pink-600 transition-colors"
                >
                  {member.name}
                </Link>
                <div className="text-xs text-gray-500">
                  👥 {member.followers} người theo dõi
                </div>
                <div className="text-xs text-yellow-500">
                  ⭐ {member.stars.toFixed(1)}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </main>

     <footer className="bg-gray-900 text-gray-300 mt-0">
  <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
    <div className="flex flex-col items-center text-xs leading-tight space-y-0">
      <ToggleFooterSection
        title="Về chúng tôi"
        items={[
          { label: "Giới thiệu", href: "/gioi-thieu" },
          { label: "Tuyển dụng", href: "/jobs" },
          { label: "Liên hệ", href: "/contact" },
        ]}
      />
    </div>

    <div className="flex flex-col items-center text-xs leading-tight space-y-0">
      <ToggleFooterSection
        title="Hỗ trợ"
        items={[
          { label: "Trung tâm trợ giúp", href: "/help" },
          { label: "Chính sách bảo mật", href: "/privacy" },
          { label: "Điều khoản sử dụng", href: "/terms" },
        ]}
      />
    </div>

    <div className="flex flex-col items-center text-xs leading-tight space-y-0">
      <ToggleFooterSection
        title="Cộng đồng"
        items={[
          { label: "Diễn đàn", href: "/forum" },
          { label: "Blog", href: "/blog" },
          { label: "Sự kiện", href: "/events" },
        ]}
      />
    </div>

    <div className="flex flex-col items-center text-xs leading-tight space-y-0">
      <ToggleFooterSection
        title="Kết nối"
        items={[
          { label: "Facebook", href: "https://facebook.com" },
          { label: "Twitter", href: "https://twitter.com" },
          { label: "Instagram", href: "https://instagram.com" },
        ]}
      />
    </div>
  </div>

  <div className="text-center text-[10px] text-gray-500 mt-0">
    © 2025 HukdClone. All rights reserved.
  </div>
</footer>

      {selectedDeal && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white border-l shadow-xl flex flex-col z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg text-pink-600">
              Bình luận sản phẩm #{selectedDeal}
            </h3>
            <button
              onClick={() => setSelectedDeal(null)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(comments[selectedDeal] || []).map((cmt) => (
              <div
                key={cmt.id}
                className="p-3 bg-gray-50 rounded-lg shadow-sm text-sm"
              >
                <p className="font-semibold">{cmt.user}</p>
                <p>{cmt.text}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
