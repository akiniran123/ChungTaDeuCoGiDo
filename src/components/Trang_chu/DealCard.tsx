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

  const mediaList =
    deal.media && deal.media.length > 0 ? deal.media : deal.image ? [deal.image] : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleShare = () => {
    const url = `${window.location.href}#deal-${deal.id}`;
    if (navigator.share) {
      navigator.share({ title: deal.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã copy link: " + url);
    }
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
      <div className="relative w-full">
        {mediaList.length > 0 &&
          (mediaList[currentIndex].endsWith(".mp4") ? (
            <video
              src={mediaList[currentIndex]}
              controls
              className={`object-cover w-full rounded-md ${
                bigger ? "h-[480px]" : "h-72"
              }`}
            />
          ) : (
            <img
              src={mediaList[currentIndex]}
              alt={deal.title}
              className={`object-cover w-full rounded-md cursor-pointer ${
                bigger ? "h-[480px]" : "h-72"
              }`}
              onClick={onImageClick}
            />
          ))}

        {mediaList.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
              ‹
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-md">
          <h3 className="font-semibold text-lg leading-snug">{deal.title}</h3>
          <div className="text-sm text-gray-200">r/{deal.category}</div>
        </div>
      </div>

      {/* Thanh tương tác */}
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 pl-3 mb-3">
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

        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={handleShare}
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

