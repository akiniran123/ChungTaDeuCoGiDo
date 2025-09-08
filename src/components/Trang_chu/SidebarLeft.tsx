"use client";
import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function SidebarLeft({
  categories,
  setShowSidebar,
}: {
  categories: { label: string; href: string }[];
  setShowSidebar: (value: boolean) => void;
}) {
  return (
    <aside className="md:col-span-1 bg-white rounded-r-xl shadow-md p-4 h-fit sticky top-28">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-pink-600">Danh mục</h3>
        <button
          onClick={() => setShowSidebar(false)}
          className="text-gray-600 hover:text-pink-600"
          aria-label="Ẩn danh mục"
        >
          <Menu size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map((cat, i) => (
          <li key={i}>
            <Link
              href={cat.href}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}