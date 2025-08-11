"use client";

import React, { useState } from "react";

function ToggleFooterSection({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1 text-left">
      <button
        className="font-semibold mb-2 w-full text-left hover:text-pink-600 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`footer-section-${title.replace(/\s+/g, "")}`}
      >
        {title}
      </button>
      {open && (
        <div
          id={`footer-section-${title.replace(/\s+/g, "")}`}
          className="flex flex-col gap-1 pl-2"
        >
          {items.map(({ label, href }, i) => (
            <a
              key={i}
              href={href}
              className="text-gray-600 hover:text-pink-500 transition-colors text-sm"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotDealsHomePage() {
  const categories = [
    "All",
    "Tech",
    "Home",
    "Fashion",
    "Groceries",
    "Travel",
    "Vouchers",
  ];

  const sampleDeals = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `🔥 Deal #${i + 1} — Giảm giá sản phẩm ${i + 1}`,
    price: `£${(10 + i * 2).toFixed(2)}`,
    store: ["Amazon", "Currys", "Argos"][i % 3],
    image: `https://picsum.photos/seed/hukd${i}/500/300`,
    votes: Math.floor(Math.random() * 600) - 50,
    comments: Math.floor(Math.random() * 120),
    hotness: Math.floor(Math.random() * 1000),
    category: categories[1 + (i % (categories.length - 1))],
  }));

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

  // Footer data
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
            aria-label="Search deals"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white shadow"
            placeholder="Search deals, products, codes..."
          />
          <nav className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white text-pink-600 font-semibold hover:bg-pink-100 transition-colors shadow-md">
              Post Deal
            </button>
            <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-md">
              Sign in
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-6 pt-28 space-y-4">
        {/* Top Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-pink-600">🔥 Top Deals</h2>
            <p className="text-sm text-gray-500">
              Community voted deals — sorted by hotness.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort:</label>
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
              <option value="hot">Hot</option>
              <option value="votes">Most votes</option>
              <option value="new">Newest</option>
            </select>
          </div>
        </div>

        {/* Deals */}
        <div className="space-y-4">
          {shown.map((deal) => (
            <article
              key={deal.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col sm:flex-row border border-pink-100"
            >
              <div className="sm:w-64 flex-shrink-0">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg hover:text-pink-500 transition-colors cursor-pointer">
                    {deal.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {deal.store} • {deal.category}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => vote(deal.id, 1)}
                      className="px-2 py-1 border rounded hover:bg-green-50 text-green-600 transition-colors"
                    >
                      ▲
                    </button>
                    <div className="text-sm font-bold text-gray-700">
                      {deal.votes}
                    </div>
                    <button
                      onClick={() => vote(deal.id, -1)}
                      className="px-2 py-1 border rounded hover:bg-red-50 text-red-600 transition-colors"
                    >
                      ▼
                    </button>
                    <span className="text-xs text-orange-500 font-semibold">
                      {deal.hotness}°
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-pink-600">
                      {deal.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      {deal.comments} comments
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length} deals
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded hover:bg-pink-50 transition-colors"
            >
              Previous
            </button>
            <div className="px-3 py-1 border rounded bg-white shadow-sm">
              {page} / {pages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1 border rounded hover:bg-pink-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-screen bg-gray-100 border-t border-gray-300 mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6 px-0">
          {footerSections.map(({ title, items }, idx) => (
            <ToggleFooterSection key={idx} title={title} items={items} />
          ))}
        </div>
      </footer>
    </div>
  );
}
