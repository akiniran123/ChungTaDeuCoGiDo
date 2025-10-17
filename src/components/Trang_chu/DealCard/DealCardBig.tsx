"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductType } from "./DealCard";

interface Props {
  product: ProductType;
  saved: string[];
  toggleSave: (id: string) => void;
  bigger?: boolean; // ✅ thêm dòng này để fix lỗi TypeScript
}

export default function DealCardBig({ product, saved, toggleSave, bigger }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const mediaList = product.image_url ? [product.image_url] : [];

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevMedia = () =>
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl shadow bg-white overflow-hidden mb-6"
    >
      {/* 🧑‍💻 User info */}
      {product.users && (
        <div className="flex items-center gap-3 p-4 border-b">
          <img
            src={product.users.avatar_url || "/default-avatar.png"}
            alt={product.users.username || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">
              {product.users.username || "Người dùng"}
            </p>
            <p className="text-xs text-gray-500">
              {product.created_at
                ? new Date(product.created_at).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Không rõ thời gian"}
            </p>
          </div>
        </div>
      )}

      {/* 🖼️ Hình ảnh lớn */}
      {mediaList.length > 0 && (
        <div className="relative group">
          <img
            src={mediaList[currentIndex]}
            alt={product.title}
            className="w-full max-h-[600px] object-cover"
            onClick={() => setShowLightbox(true)}
          />

          {mediaList.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <button
            onClick={() => toggleSave(product.id)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
          >
            {saved.includes(product.id) ? (
              <BookmarkCheck size={20} className="text-pink-500" />
            ) : (
              <Bookmark size={20} className="text-gray-600 hover:text-pink-500" />
            )}
          </button>
        </div>
      )}

      {/* 📄 Nội dung sản phẩm */}
      <div className="p-5">
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <p className="text-gray-600 mt-1">{product.category}</p>
        <p className="text-indigo-600 font-bold mt-2">
          {product.price ? product.price.toLocaleString() + "₫" : "Liên hệ"}
        </p>
        <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">
          {product.description}
        </p>

        <div className="flex justify-between text-xs text-gray-400 mt-3">
          <span>{product.views ?? 0} lượt xem</span>
          <span>❤️ {product.upvotes ?? 0}</span>
        </div>
      </div>

      {/* 🔍 Lightbox ảnh */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={mediaList[currentIndex]}
            alt="Zoom"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLightbox(false);
            }}
            className="absolute top-6 right-6 text-white bg-black/30 rounded-full p-2"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </motion.article>
  );
}
