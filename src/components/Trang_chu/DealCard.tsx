"use client";
import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";

export default function DealCard({
  deal,
  vote,
  setSelectedDeal,
  onImageClick,
  bigger = false,
}: {
  deal: {
    id: number;
    title: string;
    image?: string;
    media?: string[];
    votes: number;
    comments: number;
    category: string;
    author: string;
    content: string;
    createdAt?: string;
  };
  vote: (id: number, delta: number) => void;
  setSelectedDeal: (id: number) => void;
  onImageClick?: () => void;
  bigger?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const mediaList =
    deal.media && deal.media.length > 0 ? deal.media : deal.image ? [deal.image] : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  // Xử lý kéo ảnh
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevMedia(); // kéo sang phải -> ảnh trước
      } else {
        nextMedia(); // kéo sang trái -> ảnh sau
      }
    }
    setStartX(null);
  };

  return (
    <article
      className={`flex flex-col transition-all mx-auto bg-white rounded-lg shadow ${
        bigger ? "max-w-3xl" : "max-w-xl"
      }`}
      id={`deal-${deal.id}`}
    >
      {/* Thông tin người đăng */}
      <div className="flex items-center gap-2 px-3 py-2 border-b text-sm">
        <span className="text-xl">👤</span>
        <div>
          <p className="font-semibold">
            <Link
              href={`/user/${deal.author}`}
              className="!text-black !hover:text-black hover:underline"
            >
              {deal.author}
            </Link>
            {deal.createdAt && (
              <span className="ml-2 text-gray-500 font-normal">
                · {deal.createdAt}
              </span>
            )}
          </p>
          <p className="text-gray-600">{deal.content}</p>
        </div>
      </div>

      {/* Khối media */}
      <div
        className="relative w-full overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mediaList.length > 0 && (
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mediaList.map((item, idx) =>
              item.endsWith(".mp4") ? (
                <video
                  key={idx}
                  src={item}
                  controls
                  className={`object-cover w-full flex-shrink-0 rounded-md ${
                    bigger ? "h-[600px]" : "h-96"
                  }`}
                />
              ) : (
                <img
                  key={idx}
                  src={item}
                  alt={deal.title}
                  className={`object-cover w-full flex-shrink-0 rounded-md cursor-pointer ${
                    bigger ? "h-[600px]" : "h-96"
                  }`}
                  onClick={onImageClick}
                />
              )
            )}
          </div>
        )}

        {mediaList.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 
                         bg-black/20 hover:bg-black/30 text-white 
                         p-2 rounded-full cursor-pointer
                         opacity-0 group-hover:opacity-100 hover:opacity-80
                         transition-all duration-300"
            >
              ‹
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 
                         bg-black/20 hover:bg-black/30 text-white 
                         p-2 rounded-full cursor-pointer
                         opacity-0 group-hover:opacity-100 hover:opacity-80
                         transition-all duration-300"
            >
              ›
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/40 px-3 py-1 rounded-full">
              {mediaList.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-md">
          <h3 className="font-semibold text-lg leading-snug">{deal.title}</h3>
          <div className="text-sm text-gray-200">r/{deal.category}</div>
        </div>
      </div>

      {/* Thanh tương tác */}
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 pl-3 mb-3">
        {/* Votes */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={() => vote(deal.id, 1)}
            className="hover:text-pink-600 p-1"
            aria-label="Vote up"
          >
            <ArrowUp size={16} />
          </button>
          <span className="font-semibold text-xs text-center min-w-[20px]">
            {deal.votes || "0"}
          </span>
          <button
            onClick={() => vote(deal.id, -1)}
            className="hover:text-pink-600 p-1"
            aria-label="Vote down"
          >
            <ArrowDown size={16} />
          </button>
        </div>

        {/* Comments */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={() => setSelectedDeal(deal.id)}
            className="hover:text-pink-600 p-1"
            aria-label="Xem bình luận"
          >
            <MessageSquare size={16} />
          </button>
          <span className="font-semibold text-xs text-center min-w-[20px]">
            {deal.comments || "0"}
          </span>
        </div>

        {/* Share */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
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
            className="hover:text-pink-600 p-1"
            aria-label="Chia sẻ bài viết"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

