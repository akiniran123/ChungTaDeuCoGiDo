// components/Trang_chu/pc/SmallCardMain.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export type Product = {
  id: string;
  title: string;
  author?: string | null;
  avatar_url?: string | null;
  price?: number | null;
  category?: string | null;
  views?: number | null;
  user_id?: string | null;
};

type Props = {
  product: Product;
  commentsCount: number;

  // dùng nếu card thuộc cộng đồng
  communityId?: string | null;
  communityName?: string | null;
};

export default function SmallCardMain({
  product,
  commentsCount,
  communityId,
  communityName,
}: Props) {
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
      {/* COMMUNITY | USER */}
      <div className="mb-1 text-sm flex items-center gap-2 flex-wrap">
        {/* Tên cộng đồng */}
        {communityName && communityId && (
          <Link
            href={`/communities/${communityId}`}
            className="truncate max-w-[180px] text-gray-700 hover:opacity-80"
          >
            {communityName}
          </Link>
        )}

        {/* Dấu | mờ */}
        {communityName && (
          <span className="text-gray-300 select-none">|</span>
        )}

        {/* User */}
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
