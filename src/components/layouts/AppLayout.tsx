"use client";

import Navbar from "@/components/Navbar/pc/Navbar";
import SidebarLeft from "@/components/sidebarleft/pc/SidebarLeft";
import BottomNav from "@/components/sidebarleft/mobile/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const SIDEBAR_WIDTH = 256; // px
  const NAVBAR_HEIGHT_REM = 6.5; // chiều cao cố định Navbar (rem)

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar luôn hiển thị */}
      <Navbar />

      {/* Container chính */}
      <div
        className="flex flex-1"
        style={{ paddingTop: `${NAVBAR_HEIGHT_REM}rem` }} // đẩy nội dung xuống dưới Navbar
      >
        {/* Sidebar desktop (không fixed ở đây) */}
        <aside className="hidden md:block">
          <SidebarLeft />
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 p-4 transition-all duration-300 md:ml-[256px]">
          {children}
        </main>
      </div>

      {/* BottomNav chỉ hiển thị trên mobile (< md) */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}