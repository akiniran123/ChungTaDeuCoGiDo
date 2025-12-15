// components/Trang_chu/pc/SmallCardMain.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export type Product = {
  id: string;
  title: string;
  author?: string | null;
  avatar_url?: string | null;
  created_at?: string | Date | null;
  price?: number | null;
  category?: string | null;
  views?: number | null;
  user_id?: string | null;
};

type Props = {
  product: Product;
  commentsCount: number;
};

function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function SmallCardMain({ product, commentsCount }: Props) {
  const AuthorContent = (
    <>
      <Image
        src={product.avatar_url ?? "/default-avatar.png"}
        alt={product.author ?? "Người dùng"}
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
      <span className="truncate max-w-[150px] text-gray-900">
        {product.author ?? "Người dùng"}
      </span>
    </>
  );

  return (
    <div className="flex-1 min-w-0">
      {/* Author + date */}
      <div className="mb-1 text-sm flex items-center gap-3 flex-wrap">
        {product.user_id ? (
          <Link
            href={`/profile/${product.user_id}`}
            className="flex items-center gap-2 whitespace-nowrap hover:opacity-80 cursor-pointer"
          >
            {AuthorContent}
          </Link>
        ) : (
          <div className="flex items-center gap-2 whitespace-nowrap">
            {AuthorContent}
          </div>
        )}

        <span className="whitespace-nowrap text-gray-400 text-xs">
          {formatDate(product.created_at)}
        </span>
      </div>

      {/* Title + price */}
      <div className="flex items-center gap-3">
        <Link href={`/deal/${product.id}`} className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-gray-800 leading-snug truncate">
            {product.title}
          </div>
        </Link>

        {product.price != null && (
          <div className="ml-2 text-base font-bold text-indigo-600 whitespace-nowrap">
            {Number(product.price).toLocaleString()}₫
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-2 text-sm text-gray-500 flex items-center gap-3 flex-wrap">
        {product.category && <span>{product.category}</span>}
        <span>{commentsCount} bình luận</span>
        <span>{product.views ?? 0} lượt xem</span>
      </div>
    </div>
  );
}
