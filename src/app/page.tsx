"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Menu } from "lucide-react"; // icon vote + icon 3 gạch

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

const categories = [
  { label: "PC", href: "/category/PC" },
  { label: "Công nghệ", href: "/category/cong-nghe" },
  { label: "Nhà cửa", href: "/category/nha-cua" },
  { label: "Thời trang", href: "/category/thoi-trang" },
  { label: "Thực phẩm", href: "/category/thuc-pham" },
  { label: "Du lịch", href: "/category/du-lich" },
  { label: "Mã giảm giá", href: "/category/ma-giam-gia" },
];

const productNames = [
  "First site as I open my eyeballs this morning",
  "Camping view with sunrise",
  "Unexpected guest in the tent",
  "Night under the stars",
  "Cozy campfire vibes",
  "Rainy morning camping",
  "Hiking to the peak",
  "River crossing adventure",
  "Cooking instant noodles at night",
  "Backpacking in the forest",
  "Sunset over the lake",
  "Lost in the jungle",
  "Campfire storytelling",
  "Rain shelter with tarp",
  "Sleeping under moonlight",
  "Starry night photography",
  "Fishing at dawn",
  "Morning coffee in woods",
  "Wild animal encounter",
  "Group camping fun",
  "Chilling in hammock",
  "Exploring caves",
  "Mountain top view",
  "Snow camping experience",
  "Cooking BBQ outdoors",
  "Hot tea in the cold",
  "Solo camping meditation",
  "Bikepacking journey",
  "Kayaking with friends",
  "Relaxing by the fire",
];

type Deal = {
  id: number;
  title: string;
  image: string;
  votes: number;
  comments: number;
  category: string;
  likes: number;
  hearts: number;
  reacts: number;
  author: string;
  content: string;
};

type Comment = {
  id: number;
  user: string;
  text: string;
};

// ---- tạo nhiều deals (30 sản phẩm) ----
export const sampleDeals: Deal[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: productNames[i % productNames.length],
  image: `https://picsum.photos/seed/reddit${i}/800/600`,
  votes: Math.floor(Math.random() * 8000),
  comments: Math.floor(Math.random() * 500),
  category: "Camping",
  likes: 0,
  hearts: 0,
  reacts: 0,
  author: `Người dùng ${i + 1}`,
  content: `Đây là trải nghiệm camping số ${i + 1}, cảm giác thật tuyệt! 🌲🔥`,
}));

const communityMembers = [
  { id: 1, name: "Thành viên A", followers: 1200, stars: 4.8 },
  { id: 2, name: "Thành viên B", followers: 950, stars: 4.6 },
  { id: 3, name: "Thành viên C", followers: 800, stars: 4.5 },
  { id: 4, name: "Thành viên D", followers: 600, stars: 4.2 },
  { id: 5, name: "Thành viên E", followers: 500, stars: 4.0 },
];

export default function HotDealsHomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({
    1: [
      { id: 1, user: "Nam", text: "Ghê thật, mở mắt ra thấy con nhện 🕷" },
      { id: 2, user: "Huy", text: "Đúng cảm giác camping thật sự 😂" },
    ],
  });
  const [newComment, setNewComment] = useState("");

  const [showSidebar, setShowSidebar] = useState(true); // trạng thái ẩn/hiện sidebar

  // tải thêm sản phẩm khi thay đổi page
  useEffect(() => {
    const start = (page - 1) * perPage;
    const more = sampleDeals.slice(start, start + perPage);
    setDeals((prev) => [...prev, ...more]);
  }, [page]);

  // intersection observer cho infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (page * perPage < sampleDeals.length) {
            setPage((p) => p + 1);
          }
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [page]);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* HEADER */}
      <header className="border-b bg-white fixed w-full top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="text-2xl font-extrabold text-pink-600 cursor-pointer">
            RedditClone
          </div>
          <input
            aria-label="Tìm kiếm bài viết"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow"
            placeholder="Tìm kiếm..."
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full px-4 py-6 pt-28 grid grid-cols-1 md:grid-cols-5 gap-6 transition-all">
        {/* Sidebar trái */}
        {showSidebar && (
          <aside className="md:col-span-1 bg-white rounded-r-xl shadow-md p-4 h-fit sticky top-28">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-pink-600">Danh mục</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-600 hover:text-pink-600"
              >
                <Menu size={20} />
              </button>
            </div>
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
        )}

        {/* Nội dung chính */}
        <section
          className={`${
            showSidebar ? "md:col-span-3" : "md:col-span-4"
          } space-y-6`}
        >
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-pink-600"
            >
              <Menu size={22} /> Hiện danh mục
            </button>
          )}

          {filtered.map((deal) => (
            <article
              key={deal.id}
              className="flex flex-col transition-all max-w-xl mx-auto bg-white rounded-lg shadow"
              id={`deal-${deal.id}`}
            >
              {/* Thông tin người đăng */}
              <div className="flex items-center gap-2 px-3 py-2 border-b text-sm">
                <span className="text-xl">👤</span>
                <div>
                  <p className="font-semibold">{deal.author}</p>
                  <p className="text-gray-600">{deal.content}</p>
                </div>
              </div>

              {/* Khối ảnh */}
              <div className="relative w-full">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="object-cover w-full h-72 rounded-md"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-md">
                  <h3 className="font-semibold text-lg leading-snug">
                    {deal.title}
                  </h3>
                  <div className="text-sm text-gray-200">r/{deal.category}</div>
                </div>
              </div>

              {/* Thanh tương tác */}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-700 w-fit pl-3 mb-3">
                <div className="flex items-center bg-gray-100 rounded-full shadow-sm w-fit">
                  <button
                    onClick={() => vote(deal.id, 1)}
                    className="hover:text-pink-600 px-0.5"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <span className="font-semibold text-xs text-center">
                    {deal.votes || "0"}
                  </span>
                  <button
                    onClick={() => vote(deal.id, -1)}
                    className="hover:text-pink-600 px-0.5"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Nút comment */}
                <button
                  onClick={() => setSelectedDeal(deal.id)}
                  className="flex items-center gap-1 hover:text-pink-600 transition"
                >
                  💬 <span>{deal.comments}</span>
                </button>

                {/* Nút chia sẻ */}
                <button
                  onClick={() => {
                    const url = `${window.location.href}#deal-${deal.id}`;
                    if (navigator.share) {
                      navigator.share({ title: deal.title, url });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Đã copy link: " + url);
                    }
                  }}
                  className="flex items-center gap-1 hover:text-pink-600 transition"
                >
                  🔗 <span>Chia sẻ</span>
                </button>
              </div>
            </article>
          ))}

          {/* loader */}
          <div ref={loaderRef} className="h-10 flex justify-center items-center">
            {page * perPage < sampleDeals.length
              ? "Đang tải thêm..."
              : "Hết sản phẩm"}
          </div>
        </section>

        {/* Sidebar phải */}
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

      {/* FOOTER */}
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
          © 2025 RedditClone. All rights reserved.
        </div>
      </footer>

      {selectedDeal && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white border-l shadow-xl flex flex-col z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg text-pink-600">
              Bình luận bài #{selectedDeal}
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
