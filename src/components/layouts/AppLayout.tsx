"use client";

import { useState, createContext, useContext } from "react";
import SidebarLeft from "@/components/sidebarleft/components/SidebarLeft";

const GridContext = createContext({
  biggerGrid: false,
  toggleGrid: () => {},
});

export const useGridContext = () => useContext(GridContext);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [biggerGrid, setBiggerGrid] = useState(false);

  const toggleGrid = () => setBiggerGrid((prev) => !prev);

  return (
    <GridContext.Provider value={{ biggerGrid, toggleGrid }}>
      <div className="bg-white text-black min-h-screen">
        
        {/* 1. SIDEBAR TRÁI - Giữ nguyên z-index để không bị nội dung đè lên */}
        <div className="relative z-50">
          <SidebarLeft />
        </div>

        {/* 2. NỘI DUNG CHÍNH - Chiếm toàn bộ không gian còn lại */}
        <main
          className="transition-all duration-300 min-h-screen pt-6 pb-20 
                     md:pl-64 
                     w-full"
        >
          {/* - Bỏ xl:pr-[300px]: Để không còn khoảng trống của Sidebar phải cũ.
              - w-full: Đảm bảo nội dung kéo dài hết cỡ sang bên phải.
              - px-4 md:px-8: Tăng khoảng padding để các thẻ Note trông thoáng hơn trên màn hình lớn.
          */}
          <div className="w-full px-4 md:px-8 lg:px-10">
            {children}
          </div>
        </main>

      </div>
    </GridContext.Provider>
  );
}