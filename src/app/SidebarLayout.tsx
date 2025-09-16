"use client";
import { useState } from "react";
import SidebarLeft from "@/components/Trang_chu/SidebarLeft";
import { categories } from "@/data/data";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const SIDEBAR_WIDTH = 256; // 16rem

  return (
    <div className="flex">
      {/* SidebarLeft */}
      <div
        className="fixed left-0 top-[8rem] bg-white border-r-[1.5px] border-gray-300 transition-transform duration-300 ease-in-out"
        style={{
          width: SIDEBAR_WIDTH,
          height: "calc(100vh - 8rem)",
          transform: showSidebar ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
        }}
      >
        <SidebarLeft categories={categories} />
      </div>

      {/* Nút toggle đè 1/3 lên border */}
      <button
        onClick={() => setShowSidebar((s) => !s)}
        className="fixed z-50 w-10 h-10 bg-white border shadow rounded-l transition-all duration-300 ease-in-out"
        style={{
          top: "12rem",
          left: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          transform: "translateX(-33%)",
        }}
      >
        ☰
      </button>

      {/* Nội dung */}
      <div className="flex-1 ml-64 p-4">{children}</div>
    </div>
  );
}
