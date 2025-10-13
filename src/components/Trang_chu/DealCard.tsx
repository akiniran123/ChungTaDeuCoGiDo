"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

// ======================
// Hàm random thời gian
// ======================
function getRandomTimeAgo() {
  const minutes = Math.floor(Math.random() * 60) + 1;
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

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
  gridView?: boolean;
}

// ======================
// Grid nhỏ của page với Lightbox
// ======================
const DealCardSmall: React.FC<DealCardProps> = ({
  deal,
  vote,
  setSelectedDeal,
}) => {
  const [saved, setSaved] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();

  const mediaList =
    deal.media && deal.media.length > 0 ? deal.media : deal.image ? [deal.image] : [];

  const handleSave = () => {
    setSaved(!saved);
    addToCart({
      id: String(deal.id), // ✅ ép kiểu sang string
      name: deal.title,
      price: 0,
      image: deal.image || "",
      quantity: 1,
    });
  };

  const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  return (
    <>
      <motion.div
        key={`grid-${deal.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row items-start gap-3 p-3 border-b border-gray-200 cursor-pointer"
      >
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full md:w-40 h-32 object-cover rounded-md"
          onClick={() => setShowLightbox(true)}
        />

        <div className="flex-1 flex flex-col justify-between">
          <Link href={`/deal/${String(deal.id)}`} className="no-underline hover:text-pink-600">
            <div>
              <h3 className="font-semibold text-base md:text-lg">{deal.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{deal.content}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Link
              href={`/user/${deal.author}`}
              className="flex items-center gap-1 !text-gray-700 !no-underline hover:!text-gray-900"
            >
              <span className="text-lg">👤</span>
              <span className="font-semibold">{deal.author}</span>
            </Link>
            <span>• {deal.createdAt || getRandomTimeAgo()}</span>
          </div>

          <div className="flex items-center justify-between mt-3 text-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button onClick={() => vote(deal.id, 1)} className="hover:text-pink-600 p-1 cursor-pointer">
                  <ArrowUp size={16} />
                </button>
                <span className="font-semibold text-xs text-center min-w-[20px]">
                  {deal.votes || "0"}
                </span>
                <button onClick={() => vote(deal.id, -1)} className="hover:text-pink-600 p-1 cursor-pointer">
                  <ArrowDown size={16} />
                </button>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button onClick={() => setSelectedDeal(deal.id)} className="hover:text-pink-600 p-1 cursor-pointer">
                  <MessageSquare size={16} />
                </button>
                <span className="font-semibold text-xs text-center min-w-[20px]">
                  {deal.comments || "0"}
                </span>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                <button
                  onClick={() => {
                    const url = `${window.location.href}#deal-${String(deal.id)}`;
                    if (navigator.share) navigator.share({ title: deal.title, url });
                    else {
                      navigator.clipboard.writeText(url);
                      alert("Đã copy link: " + url);
                    }
                  }}
                  className="hover:text-pink-600 p-1 cursor-pointer"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
              <button
                onClick={handleSave}
                className={`hover:text-pink-600 p-1 cursor-pointer ${saved ? "text-pink-600" : ""}`}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {showLightbox && mediaList.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={mediaList[currentIndex]}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevMedia();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/90
                       bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3
                       transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95
                       z-[10000]"
          >
            <ChevronLeft size={36} className="drop-shadow-md" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMedia();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/90
                       bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3
                       transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95
                       z-[10000]"
          >
            <ChevronRight size={36} className="drop-shadow-md" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLightbox(false);
            }}
            className="absolute top-6 right-6 text-white/80 bg-black/20 backdrop-blur-sm
                       rounded-full p-2 hover:bg-black/40 transition-all z-[10000]"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
};

// ======================
// DealCard chính
// ======================
const DealCard: React.FC<DealCardProps> = ({
  deal,
  vote,
  setSelectedDeal,
  onImageClick,
  bigger = false,
  isAd = false,
  gridView = false,
}) => {
  const [timeAgoState, setTimeAgoState] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!deal.createdAt) setTimeAgoState(getRandomTimeAgo());
  }, [deal.createdAt]);

  const mediaList =
    deal.media && deal.media.length > 0 ? deal.media : deal.image ? [deal.image] : [];

  const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? prevMedia() : nextMedia();
    setStartX(null);
  };

  const handleSave = () => {
    setSaved(!saved);
    addToCart({
      id: String(deal.id), // ✅ ép kiểu sang string
      name: deal.title,
      price: 0,
      image: deal.image || "",
      quantity: 1,
    });
  };

  return (
    <>
      {gridView ? (
        <DealCardSmall deal={deal} vote={vote} setSelectedDeal={setSelectedDeal} />
      ) : (
        <article
          className={`flex flex-col transition-all mx-auto rounded-lg shadow ${
            bigger ? "max-w-3xl" : "max-w-xl"
          } ${isAd ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"}`}
          id={`deal-${String(deal.id)}`} // ✅ ép id thành string
        >
          {isAd && (
            <span className="text-sm font-bold text-yellow-700 m-3 inline-block">
              Quảng cáo
            </span>
          )}

          <div className="flex flex-col px-3 py-2 border-b">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/user/${deal.author}`}
                className="flex items-center gap-2 !text-gray-700 !no-underline hover:!text-gray-900"
              >
                <span className="text-xl">👤</span>
                <span className="font-semibold">{deal.author}</span>
              </Link>
              <span className="text-gray-500 font-normal">
                · {deal.createdAt ? deal.createdAt : timeAgoState}
              </span>
            </div>

            <Link
              href={`/deal/${String(deal.id)}`} // ✅ ép id thành string
              className="block mt-2 no-underline hover:text-pink-600 transition-colors"
            >
              <h3 className="font-semibold text-base md:text-lg">{deal.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{deal.content}</p>
            </Link>
          </div>

          {/* ✅ Media có next / prev */}
          <div
            className="relative w-full overflow-hidden group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {mediaList.length > 0 && (
              <>
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
                        onClick={() => setShowLightbox(true)}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                             text-white/90 bg-black/10 backdrop-blur-sm border border-white/5
                             rounded-full p-3 shadow-sm transition-all duration-300
                             hover:bg-black/25 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronLeft size={30} className="drop-shadow-sm" />
                </button>

                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                             text-white/90 bg-black/10 backdrop-blur-sm border border-white/5
                             rounded-full p-3 shadow-sm transition-all duration-300
                             hover:bg-black/25 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <ChevronRight size={30} className="drop-shadow-sm" />
                </button>
              </>
            )}
          </div>

          {/* ✅ Lightbox phóng to ảnh */}
          {showLightbox && (
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999]"
              onClick={() => setShowLightbox(false)}
            >
              <img
                src={mediaList[currentIndex]}
                alt="Zoomed"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevMedia();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/90
                           bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3
                           transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95
                           z-[10000]"
              >
                <ChevronLeft size={36} className="drop-shadow-md" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMedia();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/90
                           bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3
                           transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95
                           z-[10000]"
              >
                <ChevronRight size={36} className="drop-shadow-md" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLightbox(false);
                }}
                className="absolute top-6 right-6 text-white/80 bg-black/20 backdrop-blur-sm
                           rounded-full p-2 hover:bg-black/40 transition-all z-[10000]"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {!isAd && (
            <div className="flex items-center justify-between gap-2 mt-3 text-sm text-gray-700 pl-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                  <button onClick={() => vote(deal.id, 1)} className="hover:text-pink-600 p-1 cursor-pointer">
                    <ArrowUp size={16} />
                  </button>
                  <span className="font-semibold text-xs text-center min-w-[20px]">
                    {deal.votes || "0"}
                  </span>
                  <button onClick={() => vote(deal.id, -1)} className="hover:text-pink-600 p-1 cursor-pointer">
                    <ArrowDown size={16} />
                  </button>
                </div>

                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setSelectedDeal(deal.id)}
                    className="hover:text-pink-600 p-1 cursor-pointer"
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
                      const url = `${window.location.href}#deal-${String(deal.id)}`;
                      if (navigator.share) navigator.share({ title: deal.title, url });
                      else {
                        navigator.clipboard.writeText(url);
                        alert("Đã copy link: " + url);
                      }
                    }}
                    className="hover:text-pink-600 p-1 cursor-pointer"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm mr-3">
                <button
                  onClick={handleSave}
                  className={`hover:text-pink-600 p-1 cursor-pointer ${saved ? "text-pink-600" : ""}`}
                >
                  <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          )}
        </article>
      )}
    </>
  );
};

export default DealCard;
