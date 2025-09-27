"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  LayoutGrid,
  LayoutPanelTop,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
} from "lucide-react";

import SidebarRight from "@/components/Trang_chu/SidebarRight";
import DealCard from "@/components/Trang_chu/DealCard";
import CommentPanel from "@/components/Trang_chu/CommentPanel";

import { sampleDeals, communityMembers } from "@/data/data";
import { motion, AnimatePresence } from "framer-motion"; // ✅ thêm
import Link from "next/link"; // ✅ thêm

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

  // toggle toàn bộ layout
  const [gridMode, setGridMode] = useState(false);

  // state cho chia sẻ
  const [selectedDealShare, setSelectedDealShare] = useState<Deal | null>(null);

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
      <div className="mt-0 border-none bg-white sticky top-[56px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-1 relative">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="flex items-center justify-center p-2 bg-transparent text-gray-800 hover:text-gray-900 ml-20 cursor-pointer"
          >
            <Package className="w-6 h-6" />
          </button>

          {filterOpen && (
            <div className="absolute mt-1 bg-white border rounded-lg shadow-lg w-40 z-50">
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
      <main className="flex-1 w-full py-2 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        <section className="md:col-span-3 space-y-12">
          {filtered.map((deal, idx) => (
            <React.Fragment key={deal.id}>
              <div className="relative">
                {/* Nút toggle lưới chỉ hiển thị trên bài đầu tiên */}
                {idx === 0 && (
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={() => setGridMode((p) => !p)}
                      className="bg-gray-100 rounded-full p-2 shadow hover:bg-gray-200 transition"
                    >
                      {gridMode ? (
                        <LayoutPanelTop className="w-5 h-5 text-gray-700" />
                      ) : (
                        <LayoutGrid className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                )}

                {/* AnimatePresence để animate khi đổi layout */}
                <AnimatePresence mode="wait">
                  {!gridMode ? (
                    <motion.div
                      key={`card-${deal.id}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DealCard
                        deal={deal}
                        vote={vote}
                        setSelectedDeal={setSelectedDeal}
                        onImageClick={() => setSelectedImage(deal.image)}
                        bigger={true}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`grid-${deal.id}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-4 p-2 bg-transparent shadow-none border-b border-gray-200 ml-4"
                    >
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-40 h-28 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(deal.image)}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{deal.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {deal.content}
                        </p>
                        {/* ✅ chỗ này đã sửa thành Link */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                           <Link 
    href={`/user/${deal.author}`} 
    className="flex items-center gap-1 hover:underline text-gray-900"
  >
    <span className="text-base">👤</span>
    <span className="font-medium">{deal.author}</span>
  </Link>
</div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-4 mt-3 text-gray-600">
                          <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-full border border-gray-300">
                            <button
                              onClick={() => vote(deal.id, 1)}
                              className="hover:text-pink-600"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium">
                              {deal.votes}
                            </span>
                            <button
                              onClick={() => vote(deal.id, -1)}
                              className="hover:text-blue-600"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => setSelectedDeal(deal.id)}
                            className="flex items-center gap-1 hover:text-green-600"
                          >
                            <span className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
                              <MessageSquare className="w-4 h-4" />
                            </span>
                            {deal.comments}
                          </button>
                          <button
                            onClick={() => setSelectedDealShare(deal)}
                            className="hover:text-purple-600"
                          >
                            <span className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
                              <Share2 className="w-4 h-4" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quảng cáo sau mỗi 4 bài */}
              {(idx + 1) % 4 === 0 && (
                <>
                  {!gridMode ? (
                    <DealCard
                      deal={{
                        id: -1,
                        title: "🔥 Quảng cáo hấp dẫn!",
                        image: "/ads/ad1.jpg",
                        votes: 0,
                        comments: 0,
                        category: "Ad",
                        author: "Quảng cáo",
                        content: "Xem ngay ưu đãi đặc biệt!",
                      }}
                      vote={() => {}}
                      setSelectedDeal={() => {}}
                      onImageClick={() => {}}
                      bigger={true}
                      isAd={true}
                    />
                  ) : (
                    <div className="flex items-start gap-4 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg ml-4">
                      <img
                        src="/ads/ad1.jpg"
                        alt="Quảng cáo"
                        className="w-40 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-yellow-700">
                          Quảng cáo
                        </span>
                        <h3 className="font-semibold text-lg">
                          🔥 Quảng cáo hấp dẫn!
                        </h3>
                        <p className="text-sm text-gray-600">
                          Xem ngay ưu đãi đặc biệt!
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </React.Fragment>
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

      {/* Modal ảnh */}
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

      {/* Modal chia sẻ dạng to */}
      {selectedDealShare && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full rounded-lg p-4 relative">
            <button
              onClick={() => setSelectedDealShare(null)}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
            >
              ✕
            </button>
            <DealCard
              deal={selectedDealShare}
              vote={vote}
              setSelectedDeal={setSelectedDeal}
              onImageClick={() => setSelectedImage(selectedDealShare.image)}
              bigger={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
