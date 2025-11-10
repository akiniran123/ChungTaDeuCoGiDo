"use client";

import Link from "next/link";
import Image from "next/image";
import type { DealType } from "./DealCard";

const DealHeader = ({ deal }: { deal: DealType }) => {
  let dateText = "Không rõ";

  if (deal.createdAt) {
    // Nếu deal.createdAt là Date hoặc ISO string
    const d = new Date(deal.createdAt);
    if (!isNaN(d.getTime())) {
      dateText = d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Nếu đã là string format sẵn
      dateText = deal.createdAt;
    }
  }

  return (
    <div className="flex flex-col px-3 py-2 border-b">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/user/${deal.author || ""}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 no-underline transition"
        >
          <Image
            src={deal.avatar || "/default-avatar.png"}
            alt={deal.author || "Người dùng"}
            width={32}
            height={32}
            className="rounded-full border border-gray-200 object-cover"
          />
          <span className="font-semibold text-gray-700 hover:text-gray-900">
            {deal.author || "Người dùng"}
          </span>
        </Link>

        <span className="text-xs text-gray-400">· {dateText}</span>
      </div>

      <Link
        href={`/deal/${deal.id}`}
        className="block mt-2 no-underline hover:text-pink-500 transition-colors"
      >
        <h3 className="font-semibold text-base md:text-lg">{deal.title}</h3>
      </Link>

      {deal.content && (
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{deal.content}</p>
      )}
    </div>
  );
};

export default DealHeader;
