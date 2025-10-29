"use client";

import Link from "next/link";
import Image from "next/image";
import type { DealType } from "./DealCard"; // ✅ Import từ DealCard.tsx

const DealHeader = ({ deal }: { deal: DealType }) => {
  const dateText = deal.createdAt
    ? new Date(deal.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Không rõ";

  return (
    <div className="flex flex-col px-3 py-2 border-b">
      <div className="flex items-center gap-2 text-sm">
        {/* ✅ Link đến trang chi tiết user */}
        <Link
          href={`/user/${deal.author || ""}`}
          onClick={(e) => e.stopPropagation()} // tránh click trúng thẻ cha
          className="flex items-center gap-2 no-underline transition"
        >
          <Image
            src={deal.avatar || "/default-avatar.png"}
            alt={deal.author || "Người dùng"}
            width={32}
            height={32}
            className="rounded-full border border-gray-200 object-cover"
          />
          {/* 🖤 Màu đen nhạt */}
          <span className="font-semibold text-gray-800 hover:text-gray-900">
            {deal.author || "Người dùng"}
          </span>
        </Link>

        {/* Ngày đăng */}
        <span className="text-gray-500 font-normal">· {dateText}</span>
      </div>

      {/* Tiêu đề bài đăng */}
      <Link
        href={`/deal/${deal.id}`}
        className="block mt-2 no-underline hover:text-pink-600 transition-colors"
      >
        <h3 className="font-semibold text-base md:text-lg">{deal.title}</h3>
      </Link>

      {/* Nội dung tóm tắt */}
      {deal.content && (
        <p className="text-sm text-gray-600 line-clamp-2">{deal.content}</p>
      )}
    </div>
  );
};

export default DealHeader;
