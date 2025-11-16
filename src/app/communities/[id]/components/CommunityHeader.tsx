"use client";

import React from "react";
import type { Database } from "@/types/supabase";

export default function CommunityHeader({
  community,
  user,
}: {
  community: Database["public"]["Tables"]["communities"]["Row"];
  user?: any;
}) {
  const { title, description, category, members, online } = community;

  return (
    <header className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Header gradient */}
      <div className="h-36 w-full bg-gradient-to-r from-blue-50 to-white"></div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0">
          <div
            aria-hidden
            className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-bold"
          >
            {title ? title.charAt(0).toUpperCase() : "C"}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate">
            {title ?? "Cộng đồng không tên"}
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-600 line-clamp-3">
            {description ?? "Chưa có mô tả cho cộng đồng này."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <strong className="text-gray-700">{category ?? "Khác"}</strong>
            </span>

            <span className="text-sm text-gray-400">·</span>

            <span className="inline-flex items-center gap-2">
              👥 <span className="text-gray-700">{members ?? 0} thành viên</span>
            </span>

            <span className="text-sm text-gray-400">·</span>

            <span className="inline-flex items-center gap-2">
              🟢 <span className="text-gray-700">{online ?? 0} đang online</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
