"use client";

import React from "react";
import { Pencil } from "lucide-react";
import type { Database } from "@/types/supabase";

export default function CommunityHeader({
  community,
  user,
}: {
  community: Database["public"]["Tables"]["communities"]["Row"];
  user?: any;
}) {
  const {
    title,
    description,
    category,
    members_count,
    online_count,
    avatar_url,
    banner_url,
  } = community;

  return (
    <header className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

      {/* Banner */}
      <div className="relative w-full h-36 bg-gray-200">
        {banner_url ? (
          <img
            src={banner_url}
            alt="Community banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-50 to-white"></div>
        )}

        {/* Edit banner */}
        <button
          className="absolute top-2 right-2 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
          onClick={() => alert("Open banner upload modal")}
        >
          <Pencil className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt="Community avatar"
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100"
            />
          ) : (
            <div
              aria-hidden
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-bold"
            >
              {title ? title.charAt(0).toUpperCase() : "C"}
            </div>
          )}

          {/* Edit avatar */}
          <button
            className="absolute -top-2 -right-2 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
            onClick={() => alert("Open avatar upload modal")}
          >
            <Pencil className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">

          {/* ⭐ Title + Edit Icon ⭐ */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate">
              {title ?? "Cộng đồng không tên"}
            </h1>

            {/* Edit name */}
            <button
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              onClick={() => alert("Open name edit modal")}
            >
              <Pencil className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <p className="mt-2 text-sm md:text-base text-gray-600 line-clamp-3">
            {description ?? "Chưa có mô tả cho cộng đồng này."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <strong className="text-gray-700">{category ?? "Khác"}</strong>
            </span>

            <span className="text-sm text-gray-400">·</span>

            <span className="inline-flex items-center gap-2">
              👥 <span className="text-gray-700">{members_count ?? 0} thành viên</span>
            </span>

            <span className="text-sm text-gray-400">·</span>

            <span className="inline-flex items-center gap-2">
              🟢 <span className="text-gray-700">{online_count ?? 0} đang online</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
