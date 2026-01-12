"use client";

import { useState, createContext, useContext } from "react";
import SidebarLeft from "@/components/sidebarleft/components/SidebarLeft";
import SidebarRight from "@/components/SideBarRight/SidebarRight";

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
        
        {/* 1. SIDEBAR TRÁI - Giữ cố định bên trái */}
        <div className="relative z-50">
          <SidebarLeft />
        </div>

        {/* 2. NỘI DUNG CHÍNH - Đã bỏ paddingTop động của Header */}
        <main
          className="transition-all duration-300 min-h-screen px-4 pb-20 pt-6 md:pl-64 md:pb-6 xl:pr-[300px]"
        >
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* 3. SIDEBAR PHẢI - Giữ cố định bên phải */}
        <aside
          className="hidden xl:block fixed right-0 top-0 bg-white border-l border-gray-100 overflow-y-auto"
          style={{ width: 300, height: "100vh", zIndex: 50 }}
        >
          {/* Đã bỏ selectedCategory vì không còn HeaderBar để chọn */}
          <SidebarRight  />
        </aside>
      </div>
    </GridContext.Provider>
  );
}