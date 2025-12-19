// components/LongCard/LongCard.tsx
"use client";

import React from "react";
import useProductActions from "@/hooks/useProductActions";
import type { ProductListItem } from "@/components/ProductsList/types/products";

export type LongCardProps = {
  product: {
    id: string;
    title: string;
    image_url?: string | null;
    tags?: string[];
    author?: string;
    avatar_url?: string | null;
    created_at?: string | null;
    category?: string;
    price?: number | null;
    views?: number | null;
    community_id?: string | null;
    communityName?: string | null;
    communityIcon?: string | null;
    user_id?: string | null;
  };
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onToggleLike?: () => void;
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
  onTagClick?: (tag: string) => void;
};

export default function LongCard({
  product,
  likesCount,
  commentsCount,
  liked,
  onToggleLike,
  onToggleSave,
  onShare,
  onTagClick,
}: LongCardProps) {
  const { saved, localLikes, processing, toggleSave, toggleLike, share } = useProductActions({
    productId: product.id,
    initialLikes: likesCount,
    initialLiked: liked,
    onToggleLike,
    onToggleSave,
    onShare,
  });

  const handleLike = () => {
    // truyền trạng thái hiện tại (liked) vào hook; hook sẽ thực hiện hành động tương ứng
    toggleLike(liked);
  };

  const handleSave = () => {
    toggleSave(product.id);
  };

  const handleShare = () => {
    share(product.title);
  };

  return (
    <article className="long-card border rounded-md p-4 flex gap-4">
      <div className="long-card-media w-40 h-40 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="long-card-body flex-1 flex flex-col justify-between">
        <header>
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <div className="text-sm text-gray-500 mt-1">
            {product.author && <span>by {product.author}</span>}
            {product.category && <span className="ml-2">• {product.category}</span>}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="tags mt-2 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => onTagClick?.(t)}
                  className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </header>

        <footer className="mt-4 flex items-center justify-between">
          <div className="meta flex items-center gap-4 text-sm text-gray-600">
            <div className="likes flex items-center gap-2">
              <button
                onClick={handleLike}
                disabled={processing}
                aria-pressed={liked}
                className={`px-2 py-1 rounded ${liked ? "bg-red-100 text-red-600" : "bg-gray-100"}`}
              >
                {liked ? "Đã thích" : "Thích"}
              </button>
              <span>{localLikes}</span>
            </div>

            <div className="comments">
              <span>{commentsCount} bình luận</span>
            </div>

            {typeof product.views === "number" && (
              <div className="views">
                <span>{product.views} lượt xem</span>
              </div>
            )}
          </div>

          <div className="actions flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-2 py-1 rounded ${saved.includes(product.id) ? "bg-yellow-100" : "bg-gray-100"}`}
            >
              {saved.includes(product.id) ? "Đã lưu" : "Lưu"}
            </button>

            <button onClick={handleShare} className="px-2 py-1 rounded bg-gray-100">
              Chia sẻ
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}