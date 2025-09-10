"use client";
import React, { useState, useEffect, useRef } from "react";

import SidebarLeft from "@/components/Trang_chu/SidebarLeft";
import SidebarRight from "@/components/Trang_chu/SidebarRight";
import DealCard from "@/components/Trang_chu/DealCard";
import CommentPanel from "@/components/Trang_chu/CommentPanel";
import Footer from "@/components/Trang_chu/Footer";

import { sampleDeals, categories, communityMembers } from "@/data/data";

export type Deal = {
  id: number;
  title: string;
  image: string;
  votes: number;
  comments: number;
  category: string;
  author: string;
  content: string;
};

export type Comment = {
  id: number;
  user: string;
  text: string;
};

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
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const start = (page - 1) * perPage;
    const more = sampleDeals.slice(start, start + perPage);
    setDeals((prev) => [...prev, ...more]);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page * perPage < sampleDeals.length) {
          setPage((p) => p + 1);
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
    const newCmt: Comment = { id: Date.now(), user: "Bạn", text: newComment };
    setComments((prev) => ({
      ...prev,
      [selectedDeal]: [...(prev[selectedDeal] || []), newCmt],
    }));
    setNewComment("");
  }

  const filtered = deals.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const SIDEBAR_WIDTH = "16rem";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
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

      <main className="flex-1 w-full px-4 py-6 pt-28 grid grid-cols-1 md:grid-cols-5 gap-6 relative">
        <div
          className="md:col-span-1 relative z-20"
          style={{ ["--sidebar-w" as any]: SIDEBAR_WIDTH } as React.CSSProperties}
        >
          <div
            className="sticky top-24 h-fit max-h-[calc(100vh-6rem)] flex overflow-hidden 
                       transition-transform duration-300 ease-in-out bg-white shadow-md rounded-r-xl"
            style={{
              width: "var(--sidebar-w)",
              transform: showSidebar
                ? "translateX(0)"
                : "translateX(calc(-1 * var(--sidebar-w)))",
            }}
          >
            <div className="w-full">
              <SidebarLeft categories={categories} setShowSidebar={setShowSidebar} />
            </div>
            <div className="w-px bg-gray-300 h-full" />
          </div>

          {/* Hamburger button - đã hạ xuống thấp hơn */}
          <button
            onClick={() => setShowSidebar((s) => !s)}
            aria-label={showSidebar ? "Đóng menu" : "Mở menu"}
            className="fixed top-64 left-0 z-50 flex items-center justify-center w-10 h-10
                       text-gray-600 hover:text-pink-600 bg-white rounded-r-md shadow
                       transition-transform duration-300 ease-in-out"
            style={{
              transform: showSidebar
                ? `translateX(var(--sidebar-w))`
                : "translateX(0)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <section className="md:col-span-3 space-y-6">
          {filtered.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              vote={vote}
              setSelectedDeal={setSelectedDeal}
            />
          ))}

          <div ref={loaderRef} className="h-10 flex justify-center items-center">
            {page * perPage < sampleDeals.length ? "Đang tải thêm..." : "Hết sản phẩm"}
          </div>
        </section>

        <div className="md:col-span-1 relative z-10">
          <SidebarRight communityMembers={communityMembers} />
        </div>
      </main>

      <Footer />

      {selectedDeal && (
        <CommentPanel
          selectedDeal={selectedDeal}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          setSelectedDeal={setSelectedDeal}
        />
      )}
    </div>
  );
}
