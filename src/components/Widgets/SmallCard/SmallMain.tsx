// components/Trang_chu/pc/SmallCardMain.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  author?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  price?: number | null;
  category?: string | null;
  views?: number | null;
  user_id: string;
};

type Props = {
  product: Product;
  commentsCount: number;
};

export default function SmallCardMain({ product, commentsCount }: Props) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-1 text-sm flex items-center gap-3 flex-wrap">
        <Link
          href={`/profile/${product.user_id}`}
          className="flex items-center gap-2 whitespace-nowrap hover:opacity-80 cursor-pointer"
        >
          <Image
            src={product.avatar_url || "/default-avatar.png"}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <span className="truncate max-w-[150px] text-gray-900">
            {product.author || "Người dùng"}
          </span>
        </Link>

        <span className="whitespace-nowrap text-gray-400 text-xs">
          {product.created_at
            ? new Date(product.created_at).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : ""}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link href={`/deal/${product.id}`} className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-gray-800 leading-snug truncate">
            {product.title}
          </div>
        </Link>

        {product.price && (
          <div className="ml-2 text-base font-bold text-indigo-600 whitespace-nowrap">
            {product.price.toLocaleString()}₫
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500 flex items-center gap-3 flex-wrap">
        {product.category && <span className="whitespace-nowrap">{product.category}</span>}

        <span className="whitespace-nowrap">{commentsCount} bình luận</span>

        <span className="whitespace-nowrap">{product.views ?? 0} lượt xem</span>
      </div>
    </div>
  );
}