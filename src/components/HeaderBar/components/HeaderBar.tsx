"use client";

import { LayoutGrid, Grid } from "lucide-react";
import SearchBar from "@/components/Search/components/SearchBar";
import React, { forwardRef, useState, useRef, useEffect } from "react";

type Props = {
  biggerGrid: boolean;
  toggleGrid: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  categories?: string[];
};

const FILTER_TABS = ["For you", "Hottest", "Trending"];

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
  const [activeTab, setActiveTab] = useState("For you");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Tính toán vị trí gạch chân cho thanh dưới
  useEffect(() => {
    const activeIndex = FILTER_TABS.indexOf(activeTab);
    const activeRoute = tabsRef.current[activeIndex];
    if (activeRoute) {
      setUnderlineStyle({
        left: activeRoute.offsetLeft,
        width: activeRoute.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div ref={ref} className="bg-white w-full ">
      
      {/* 1. Thanh Danh Mục (Top Menu) */}
      <div className="flex justify-center ">
        <div className="flex items-center overflow-x-auto no-scrollbar px-6 py-1 gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative py-3 px-1 text-[13px] transition-all duration-200 whitespace-nowrap outline-none ${
                  isActive ? "text-[#ff4500] font-bold" : "text-gray-500 font-normal hover:text-gray-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Thanh Công cụ (Toolbar) - Giảm gap từ 8 xuống 2 để các phần tử sát nhau */}
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-2 h-[64px]">
        
        {/* Nhóm Filter Tabs - Căn trái */}
        <div className="relative flex items-center h-full">
          {FILTER_TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => { tabsRef.current[index] = el; }}
              onClick={() => setActiveTab(tab)}
              className={`relative h-full px-4 text-[15px] transition-colors duration-300 outline-none ${
                activeTab === tab ? "text-[#ff4500] font-bold" : "text-gray-400 hover:text-black font-medium"
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Underline chạy mượt */}
          <div 
            className="absolute bottom-0 h-[3px] bg-[#ff4500] rounded-t-full transition-all duration-300"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>

        {/* Thanh tìm kiếm - Giữ nguyên logic của bạn */}
        <div className="flex-grow max-w-[600px]">
           <div className="bg-[#F5F5F5] rounded-full px-1">
              <SearchBar 
                userId={"demo-user"} 
                onSearch={(q) => console.log("Searching:", q)} 
              />
           </div>
        </div>

        {/* Nút Chế độ xem */}
        <button
          onClick={toggleGrid}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all active:scale-95 flex-shrink-0"
        >
          {biggerGrid ? <Grid size={18} strokeWidth={2.5} /> : <LayoutGrid size={18} strokeWidth={2.5} />}
          <span className="hidden lg:inline text-gray-700">Chế độ xem</span>
        </button>

      </div>
    </div>
  );
});

HeaderBar.displayName = "HeaderBar";
export default HeaderBar;