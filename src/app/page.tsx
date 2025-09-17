"use client";
import React, { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";

import SidebarRight from "@/components/Trang_chu/SidebarRight";
import DealCard from "@/components/Trang_chu/DealCard";
import CommentPanel from "@/components/Trang_chu/CommentPanel";

import { sampleDeals, communityMembers } from "@/data/data";

export type Deal = {
  id: number;
  title: string;
  image: string;
  votes: number;
  comments: number;
  category: string;
  author: string;
  content: string;
  createdAt?: string;
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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("");

  useEffect(() => {
    const start = (page - 1) * perPage;
    const more = sampleDeals.slice(start, start + perPage).map((deal) => ({
      ...deal,
      createdAt: deal.createdAt || "2025-09-16T10:00:00",
    }));
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

  const filtered = deals
    .filter((d) => d.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (activeFilter === "hot") return b.votes - a.votes;
      if (activeFilter === "new")
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      if (activeFilter === "best") return b.comments - a.comments;
      if (activeFilter === "top")
        return b.votes + b.comments - (a.votes + a.comments);
      if (activeFilter === "trending")
        return b.comments * 2 + b.votes - (a.comments * 2 + a.votes);
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b-[1.5px] border-gray-300 bg-white fixed w-full top-0 z-40 shadow-sm">
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

      {/* Bộ lọc */}
      <div className="mt-16 border-none bg-white sticky top-[56px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="flex items-center justify-center p-2 bg-transparent text-gray-800 hover:text-gray-900 ml-20 cursor-pointer"
          >
            <Package className="w-6 h-6" />
          </button>

          {filterOpen && (
            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-40 z-50">
              <button
                onClick={() => {
                  setActiveFilter("best");
                  setFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Hay nhất
              </button>
              <button
                onClick={() => {
                  setActiveFilter("hot");
                  setFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Hot
              </button>
              <button
                onClick={() => {
                  setActiveFilter("new");
                  setFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Mới
              </button>
              <button
                onClick={() => {
                  setActiveFilter("top");
                  setFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Hàng đầu
              </button>
              <button
                onClick={() => {
                  setActiveFilter("trending");
                  setFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Đang nổi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <main className="flex-1 w-full py-6 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        <section className="md:col-span-3 space-y-6">
          {filtered.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              vote={vote}
              setSelectedDeal={setSelectedDeal}
              onImageClick={() => setSelectedImage(deal.image)}
              bigger
            />
          ))}

          <div ref={loaderRef} className="h-10 flex justify-center items-center">
            {page * perPage < sampleDeals.length
              ? "Đang tải thêm..."
              : "Hết sản phẩm"}
          </div>
        </section>

        <div className="md:col-span-1 relative z-10">
          <SidebarRight communityMembers={communityMembers} />
        </div>
      </main>

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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoom"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
