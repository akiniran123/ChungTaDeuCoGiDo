"use client";

import { useState, useRef, useLayoutEffect, createContext, useContext } from "react";
import SidebarLeft from "@/components/sidebarleft/components/SidebarLeft";
import SidebarRight from "@/components/SideBarRight/SidebarRight";
import HeaderBar from "@/components/HeaderBar/components/HeaderBar";
import { useScrollHeader } from "@/components/HeaderBar/hooks/useScrollHeader";

const GridContext = createContext({
  biggerGrid: false,
  toggleGrid: () => {},
});

export const useGridContext = () => useContext(GridContext);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [biggerGrid, setBiggerGrid] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(160);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const { showHeader } = useScrollHeader();

  const toggleGrid = () => setBiggerGrid((prev) => !prev);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <GridContext.Provider value={{ biggerGrid, toggleGrid }}>
      <div className="bg-white text-black min-h-screen">
        
        {/* 1. SIDEBAR TRÁI - Nổi lên trên cùng (Z-50) */}
        <div className="relative z-50">
          <SidebarLeft />
        </div>

        {/* 2. HEADER CONTAINER - Chìm xuống dưới Sidebars (Z-40) */}
        <div
          className={`
            fixed top-0 right-0 left-0 z-40
            bg-white border-b transition-transform duration-300 ease-in-out
            ${showHeader ? "translate-y-0" : "-translate-y-full"}
            /* Đảm bảo nội dung header không bị Sidebar che khuất */
            md:pl-64 
            xl:pr-[300px]
          `}
        >
          <HeaderBar
            ref={headerRef}
            biggerGrid={biggerGrid}
            toggleGrid={toggleGrid}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* 3. NỘI DUNG CHÍNH */}
        <main
          className="transition-all duration-300 min-h-screen px-4 pb-20 md:pl-64 md:pb-6 xl:pr-[300px]"
          style={{ paddingTop: `${headerHeight + 10}px` }}
        >
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* 4. SIDEBAR PHẢI - Nổi lên trên cùng (Z-50) */}
        <aside
          className="hidden xl:block fixed right-0 top-0 bg-white border-l overflow-y-auto"
          style={{ width: 300, height: "100vh", zIndex: 50 }}
        >
          <SidebarRight selectedCategory={selectedCategory} />
        </aside>
      </div>
    </GridContext.Provider>
  );
}