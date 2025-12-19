// components/layouts/AppLayout.tsx
"use client";

import { useState } from "react";
import SidebarLeft from "@/components/sidebarleft/pc/SidebarLeft";
import SidebarRight from "@/components/SideBarRight/SidebarRight";
import BottomNav from "@/components/sidebarleft/mobile/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SIDEBAR_LEFT_WIDTH = 250; // px
  const SIDEBAR_RIGHT_WIDTH = 300; // px

  // keep selectedCategory value for passing to SidebarRight
  const [selectedCategory] = useState<string | null>(null);

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
            height: "100vh",
            top: 0,
            zIndex: 30,
          }}
        >
          <SidebarRight selectedCategory={selectedCategory} />
        </div>

        {/* Nội dung chính */}
        <main
          className="flex-1 px-4 py-6 transition-all duration-300"
          style={{
            paddingLeft: SIDEBAR_LEFT_WIDTH,
            paddingRight: SIDEBAR_RIGHT_WIDTH,
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
