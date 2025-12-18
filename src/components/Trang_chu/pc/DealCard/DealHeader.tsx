"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductWithUser } from "@/components/ProductsList/types/products";

type FlatDeal = {
  id: string;
  title?: string | null;
  content?: string | null;
  author?: string | null;
  author_id?: string | null;
  avatar?: string | null;
  category?: string | null;
  createdAt?: string | Date | null;
};

type DealType = ProductWithUser | FlatDeal;

const DealHeader = ({ deal }: { deal: DealType }) => {
  // Normalized getters with fallbacks for both shapes
  const author =
    // flat object has 'author'
    (deal as FlatDeal).author ??
    // ProductWithUser stores username under users?.username
    (deal as ProductWithUser).users?.username ??
    null;

  const authorId =
    (deal as FlatDeal).author_id ?? (deal as ProductWithUser).users?.id ?? null;

  const avatar =
    (deal as FlatDeal).avatar ??
    (deal as ProductWithUser).users?.avatar_url ??
    "/default-avatar.png";

  const category =
    (deal as FlatDeal).category ?? (deal as ProductWithUser).category ?? null;

  const title = (deal as FlatDeal).title ?? (deal as ProductWithUser).title ?? "";
  const content =
    (deal as FlatDeal).content ?? (deal as ProductWithUser).description ?? null;
  const id = (deal as FlatDeal).id ?? (deal as ProductWithUser).id;

  // createdAt can be either createdAt (flat) or created_at (ProductWithUser)
  const createdRaw =
    (deal as FlatDeal).createdAt ?? (deal as ProductWithUser).created_at ?? null;

  let dateText = "Không rõ";

  if (createdRaw) {
    const d = new Date(createdRaw as string | number | Date);
    if (!isNaN(d.getTime())) {
      dateText = d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      dateText = String(createdRaw);
    }
  }

  return (
    <div className="flex flex-col px-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        {/* Nhấn avatar mở profile theo user_id */}
        <Link
          href={`/profile/${authorId || ""}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 no-underline transition"
        >
          <Image
            src={avatar || "/default-avatar.png"}
            alt={author || "Người dùng"}
            width={32}
            height={32}
            className="rounded-full border border-gray-200 object-cover"
          />
          <span className="font-semibold text-gray-700 hover:text-gray-900">
            {author || "Người dùng"}
          </span>
        </Link>

        {category && (
          <>
            <span className="text-gray-400">•</span>
            <Link
              href={`/category/${category}`}
              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              {category}
            </Link>
          </>
        )}

        <span className="text-xs text-gray-400">· {dateText}</span>
      </div>

      <Link
        href={`/deal/${id}`}
        className="block mt-2 no-underline hover:text-pink-500 transition-colors"
      >
        <h3 className="font-semibold text-base md:text-lg">{title}</h3>
      </Link>

      {content && (
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{content}</p>
      )}
    </div>
  );
};

export default DealHeader;