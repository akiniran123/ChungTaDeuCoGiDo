// components/layouts/AppLayout.tsx
"use client";

import { useState } from "react";
import SidebarLeft from "@/components/sidebarleft/pc/SidebarLeft";
import SidebarRight from "@/components/Trang_chu/pc/SidebarRight";
import BottomNav from "@/components/sidebarleft/mobile/BottomNav";
import NavBar from "@/components/Widgets/NavBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SIDEBAR_LEFT_WIDTH = 290; // px
  const SIDEBAR_RIGHT_WIDTH = 300; // px
  const NAVBAR_HEIGHT = 110; // điều chỉnh nếu navbar cao hơn

  const [biggerGrid, setBiggerGrid] = useState(false);
  const toggleGrid = () => setBiggerGrid((s) => !s);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* Layout chính */}
      <div className="flex flex-1 relative">
        {/* Sidebar trái */}
        <div
          className="hidden md:block fixed left-0 top-0 bg-white"
          style={{
            width: SIDEBAR_LEFT_WIDTH,
            height: "100vh",
            zIndex: 40,
          }}
        >
          <SidebarLeft />
        </div>

        {/* Sidebar phải */}
        <div
          className="hidden xl:block fixed right-0 bg-white px-4 py-6 overflow-y-auto"
          style={{
            width: SIDEBAR_RIGHT_WIDTH,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            top: `${NAVBAR_HEIGHT}px`,
            zIndex: 30,
          }}
        >
          <SidebarRight selectedCategory={selectedCategory} />
        </div>

        {/* Navbar nằm giữa hai sidebar, fixed top (Cách A) */}
        <div
          className="hidden md:block fixed"
          style={{
            left: SIDEBAR_LEFT_WIDTH,
            right: SIDEBAR_RIGHT_WIDTH,
            top: 0,
            zIndex: 50,
            height: NAVBAR_HEIGHT,
          }}
        >
          <div className="w-full max-w-[1200px] mx-auto px-4">
            <NavBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
   
            />
          </div>
        </div>

        {/* Nội dung chính */}
        <main
          className="flex-1 px-4 py-6 transition-all duration-300"
          style={{
            paddingLeft: SIDEBAR_LEFT_WIDTH,
            paddingRight: SIDEBAR_RIGHT_WIDTH,
            paddingTop: NAVBAR_HEIGHT, // tránh bị navbar che
          }}
        >
          {children}
        </main>
      </div>

      {/* BottomNav cho mobile */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}