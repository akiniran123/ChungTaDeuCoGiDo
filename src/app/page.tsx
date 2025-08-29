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

type Comment = {
  id: number;
  user: string;
  text: string;
};

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
            placeholder="Tìm kiếm ưu đãi..."
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full px-4 py-6 pt-28 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar trái */}
        <aside className="md:col-span-1 bg-white rounded-r-xl shadow-md p-4 h-fit sticky top-28">
          <h3 className="font-bold text-lg mb-3 text-pink-600">Danh mục</h3>
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    setPage(1);
                    if (cat === "Tất cả") {
                      setDeals(sampleDeals);
                    } else {
                      setDeals(sampleDeals.filter((d) => d.category === cat));
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Danh sách ưu đãi */}
        <section className="md:col-span-3 space-y-4">
          {shown.map((deal) => (
            <article
              key={deal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col sm:flex-row border border-pink-100"
            >
              <div className="sm:w-64 flex-shrink-0 relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold rounded px-2 py-0.5">
                  {deal.category}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <h3 className="font-semibold text-lg hover:text-pink-500 transition-colors cursor-pointer">
                  {deal.title}
                </h3>
                <div className="text-sm text-gray-500">{deal.store}</div>
                <div className="mt-4 flex items-center justify-between">
                  {/* Cột nút */}
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

                    {/* Nút comment */}
                    <button
                      onClick={() => setSelectedDeal(deal.id)}
                      className="px-2 py-1 border rounded hover:bg-blue-50 text-blue-600 flex items-center gap-1"
                    >
                      💬 <span className="text-xs">{deal.comments}</span>
                    </button>

                    {/* Nút share */}
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
      </main>

      {/* Sidebar comment */}
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
