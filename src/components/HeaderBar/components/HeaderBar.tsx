// components/Trang_chu/pc/HeaderBar.tsx
"use client";

import { LayoutGrid, Grid } from "lucide-react";
import SearchBar from "@/components/Search/components/SearchBar";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  biggerGrid: boolean;
  toggleGrid: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  categories?: string[];
};

export default function HeaderBar({
  biggerGrid,
  toggleGrid,
  selectedCategory,
  setSelectedCategory,
  categories = [
    "Saved",
    "Electronics",
    "Motors",
    "Fashion",
    "Collectibles & Art",
    "Sports",
    "Health & Beauty",
    "Industrial equipment",
    "Home & Garden",
  ],
}: Props) {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-30 bg-white"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-center justify-center text-[12px] overflow-x-auto no-scrollbar px-2 py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-red-100 text-red-700 shadow-sm "
                : "text-gray-700 "
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-2 py-2 px-2">
        <SearchBar userId={"demo-user"} onSearch={(q) => console.log("Searching:", q)} />
      </div>

      <div className="pb-2 flex items-center gap-2 px-2">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          <span>Best</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={toggleGrid}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
            biggerGrid
              ? "bg-pink-100 text-pink-600 border-pink-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {biggerGrid ? <Grid size={16} /> : <LayoutGrid size={16} />}
          Chế độ xem
        </button>
      </div>
    </motion.div>
  );
}