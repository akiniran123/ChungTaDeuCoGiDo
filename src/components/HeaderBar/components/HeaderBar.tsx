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
      className="bg-white w-full border-b border-gray-100"
    >
      {/* 1. Categories Row - Căn giữa */}
      <div className="flex justify-center border-b border-gray-50">
        <div className="flex items-center text-[12px] overflow-x-auto no-scrollbar px-2 py-2 w-fit max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? "bg-red-100 text-red-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search Bar Row - Căn giữa và giới hạn độ rộng */}
      <div className="py-3 px-4 flex justify-center">
        <div className="w-full max-w-3xl"> 
          <SearchBar userId={"demo-user"} onSearch={(q) => console.log("Searching:", q)} />
        </div>
      </div>

      {/* 3. Filters Row - Căn giữa */}
      <div className="pb-3 flex items-center justify-center gap-4 px-4">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md border border-transparent">
          <span>Sắp xếp: Best</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="h-4 w-[1px] bg-gray-200"></div> {/* Thanh chia nhỏ */}

        <button
          onClick={toggleGrid}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          {biggerGrid ? <Grid size={16} /> : <LayoutGrid size={16} />}
          <span>Chế độ xem</span>
        </button>
      </div>
    </div>
  );
});

HeaderBar.displayName = "HeaderBar";
export default HeaderBar;