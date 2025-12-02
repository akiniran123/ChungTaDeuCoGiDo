"use client";

import Navbar from "@/components/Navbar/pc/Navbar";
import SidebarLeft from "@/components/sidebarleft/pc/SidebarLeft";
import BottomNav from "@/components/sidebarleft/mobile/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const SIDEBAR_WIDTH = 256;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar luôn hiển thị */}
    

      {/* Container chính */}
      <div className="flex pt-[4.5rem] flex-1">
        {/* Sidebar chỉ hiển thị trên màn hình >= md (desktop) */}
        <aside
          className="hidden md:block fixed left-0 top-[4.5rem] bg-white border-r shadow-sm"
          style={{
            width: SIDEBAR_WIDTH,
            height: "calc(100vh - 4.5rem)",
            zIndex: 40,
          }}
        >
          <SidebarLeft />
        </aside>

        {/* Nội dung chính */}
        <main
          className="flex-1 p-4 transition-all duration-300"
          style={{ marginLeft: SIDEBAR_WIDTH }}
        >
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