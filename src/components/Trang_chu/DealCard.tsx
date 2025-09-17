"use client";
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function DealCard({
  deal,
  vote,
  setSelectedDeal,
  onImageClick,
  bigger = false, // ✅ mặc định false
}: {
  deal: {
    id: number;
    title: string;
    image: string;
    votes: number;
    comments: number;
    category: string;
    author: string;
    content: string;
  };
  vote: (id: number, delta: number) => void;
  setSelectedDeal: (id: number) => void;
  onImageClick?: () => void;
  bigger?: boolean; // ✅ thêm prop này
}) {
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
      }`} // ✅ to hơn nếu có prop bigger
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
          className={`object-cover w-full rounded-md cursor-pointer ${
            bigger ? "h-[480px]" : "h-72"
          }`} // ✅ ảnh cao hơn khi to
          onClick={onImageClick}
        />
        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-md">
          <h3 className="font-semibold text-lg leading-snug">{deal.title}</h3>
          <div className="text-sm text-gray-200">r/{deal.category}</div>
        </div>
      </div>

      {/* Thanh tương tác */}
      <div className="flex items-center gap-4 mt-3 text-sm text-gray-700 w-fit pl-3 mb-3">
        <div className="flex items-center bg-gray-100 rounded-full shadow-sm w-fit">
          <button
            onClick={() => vote(deal.id, 1)}
            className="hover:text-pink-600 px-0.5"
            aria-label="Vote up"
          >
            <ArrowUp size={14} />
          </button>
          <span className="font-semibold text-xs text-center">
            {deal.votes || "0"}
          </span>
          <button
            onClick={() => vote(deal.id, -1)}
            className="hover:text-pink-600 px-0.5"
            aria-label="Vote down"
          >
            <ArrowDown size={14} />
          </button>
        </div>

        <button
          onClick={() => setSelectedDeal(deal.id)}
          className="flex items-center gap-1 hover:text-pink-600 transition"
          aria-label="Xem bình luận"
        >
          💬 <span>{deal.comments}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-pink-600 transition"
          aria-label="Chia sẻ bài viết"
        >
          🔗 <span>Chia sẻ</span>
        </button>
      </div>
    </article>
  );
}
