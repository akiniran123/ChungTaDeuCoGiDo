"use client";
import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";

export type DealType = {
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

export interface DealCardProps {
  deal: DealType;
  vote: (id: number, delta: number) => void;
  setSelectedDeal: (id: number) => void;
  onImageClick?: () => void;
  bigger?: boolean;
  isAd?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({
  deal,
  vote,
  setSelectedDeal,
  onImageClick,
  bigger = false,
  isAd = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const mediaList =
    deal.media && deal.media.length > 0
      ? deal.media
      : deal.image
      ? [deal.image]
      : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevMedia();
      } else {
        nextMedia();
      }
    }
    setStartX(null);
  };

  // =========================
  // Layout ngang (small card)
  // =========================
  if (!bigger) {
    return (
      <article
        id={`deal-${deal.id}`}
        className={`flex items-start gap-3 rounded-lg border shadow-sm p-3 max-w-3xl mx-auto ${
          isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"
        }`}
      >
        {mediaList.length > 0 && (
          <div
            className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-md cursor-pointer"
            onClick={!isAd ? onImageClick : undefined}
          >
            {mediaList[0].endsWith(".mp4") ? (
              <video src={mediaList[0]} className="object-cover w-full h-full" muted />
            ) : (
              <img
                src={mediaList[0]}
                alt={deal.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link
              href={`/user/${deal.author}`}
              className="font-semibold hover:underline text-gray-800"
            >
              {deal.author}
            </Link>
            {deal.createdAt && <span>· {deal.createdAt}</span>}
          </div>

          <Link
            href={`/deal/${deal.id}`}
            className="block font-semibold text-gray-900 hover:underline line-clamp-2"
          >
            {deal.title}
          </Link>

          {isAd && (
            <span className="text-xs font-bold text-yellow-700 inline-block mt-1">
              Quảng cáo
            </span>
          )}

          {!isAd && (
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <button
                onClick={() => vote(deal.id, 1)}
                className="flex items-center gap-1 hover:text-pink-600"
              >
                <ArrowUp size={16} /> {deal.votes}
              </button>
              <button
                onClick={() => vote(deal.id, -1)}
                className="hover:text-pink-600"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => setSelectedDeal(deal.id)}
                className="flex items-center gap-1 hover:text-pink-600"
              >
                <MessageSquare size={16} /> {deal.comments}
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.href}#deal-${deal.id}`;
                  if (navigator.share) {
                    navigator.share({ title: deal.title, url });
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("📋 Link đã được copy: " + url);
                  }
                }}
                className="hover:text-pink-600"
                aria-label="Chia sẻ bài viết"
              >
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>
      </article>
    );
  }

  // =========================
  // Layout dọc (big card)
  // =========================
  return (
    <article
      className={`flex flex-col transition-all mx-auto rounded-lg shadow ${
        bigger ? "max-w-3xl" : "max-w-xl"
      } ${isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"}`}
      id={`deal-${deal.id}`}
    >
      {isAd && (
        <span className="text-sm font-bold text-yellow-700 m-3 inline-block">
          Quảng cáo
        </span>
      )}

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
                  controls={!isAd}
                  className={`object-cover w-full flex-shrink-0 rounded-md ${
                    bigger ? "h-[600px]" : "h-96"
                  }`}
                />
              ) : (
                <img
                  key={idx}
                  src={item}
                  alt={deal.title}
                  className={`object-cover w-full flex-shrink-0 rounded-md ${
                    bigger ? "h-[600px]" : "h-96"
                  }`}
                  onClick={!isAd ? onImageClick : undefined}
                />
              )
            )}
          </div>
        )}

        {mediaList.length > 1 && !isAd && (
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
          </>
        )}

        <Link
          href={`/deal/${deal.id}`}
          className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-md 
             cursor-pointer hover:bg-black/60 transition block z-20"
        >
          <div>
            <h3 className="font-semibold text-lg leading-snug">{deal.title}</h3>
            <div className="text-sm text-gray-200">r/{deal.category}</div>
          </div>
        </Link>
      </div>

      {!isAd && (
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 pl-3 mb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <button
              onClick={() => vote(deal.id, 1)}
              className="hover:text-pink-600 p-1 cursor-pointer"
              aria-label="Vote up"
            >
              <ArrowUp size={16} />
            </button>
            <span className="font-semibold text-xs text-center min-w-[20px]">
              {deal.votes || "0"}
            </span>
            <button
              onClick={() => vote(deal.id, -1)}
              className="hover:text-pink-600 p-1 cursor-pointer"
              aria-label="Vote down"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <button
              onClick={() => setSelectedDeal(deal.id)}
              className="hover:text-pink-600 p-1 cursor-pointer"
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
              onClick={() => {
                const url = `${window.location.href}#deal-${deal.id}`;
                if (navigator.share) {
                  navigator.share({ title: deal.title, url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Đã copy link: " + url);
                }
              }}
              className="hover:text-pink-600 p-1 cursor-pointer"
              aria-label="Chia sẻ bài viết"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default DealCard;
