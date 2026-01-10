"use client";

import { LayoutGrid, Grid } from "lucide-react";
import SearchBar from "@/components/Search/components/SearchBar";
import React, { forwardRef } from "react";

type Props = {
  biggerGrid: boolean;
  toggleGrid: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  categories?: string[];
};

// Sử dụng forwardRef để Layout cha có thể đo được chiều cao thực tế của Header
const HeaderBar = forwardRef<HTMLDivElement, Props>(({
  biggerGrid,
  toggleGrid,
  selectedCategory,
  setSelectedCategory,
  categories = [
    "Saved", "Electronics", "Motors", "Fashion", 
    "Collectibles & Art", "Sports", "Health & Beauty", 
    "Industrial equipment", "Home & Garden"
  ],
}, ref) => {
  return (
    <div 
      ref={ref}
      className="bg-white w-full" // Bỏ sticky và motion ở đây
    >
      {/* Categories Row */}
      <div className="flex items-center text-[12px] overflow-x-auto no-scrollbar px-2 py-2 border-b border-gray-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-red-100 text-red-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar Row */}
      <div className="py-2 px-2">
        <SearchBar userId={"demo-user"} onSearch={(q) => console.log("Searching:", q)} />
      </div>

      {/* Filters Row */}
      <div className="pb-2 flex items-center gap-2 px-2">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md border border-transparent">
          <span>Best</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={toggleGrid}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer border transition-colors ${
            biggerGrid
              ? "bg-pink-100 text-pink-600 border-pink-200"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {biggerGrid ? <Grid size={16} /> : <LayoutGrid size={16} />}
          Chế độ xem
        </button>
      </div>
    </div>
  );
});

HeaderBar.displayName = "HeaderBar";
export default HeaderBar;