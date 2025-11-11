"use client";

import { useState } from "react";
import SidebarLeft from "@/components/Trang_chu/SidebarLeft";
import { categories } from "@/data/data";

// ✅ Thêm import FirebaseInit
import FirebaseInit from "@/components/FirebaseInit";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const SIDEBAR_WIDTH = 256; // 16rem

  return (
    <>
      {/* ✅ Khởi tạo Firebase chỉ 1 lần ở đây */}
      <FirebaseInit />

      <div className="flex">
        {/* SidebarLeft */}
        <div
          className="fixed left-0 top-[4.5rem] bg-white border-r-[1.5px] border-gray-300 transition-transform duration-300 ease-in-out"
          style={{
            width: SIDEBAR_WIDTH,
            height: "calc(100vh - 4.5rem)",
            transform: showSidebar ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
          }}
        >
          <SidebarLeft categories={categories} />
        </div>

        {/* Nút toggle */}
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

        {/* Nội dung chính */}
        <div
          className="flex-1 p-4 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: showSidebar ? SIDEBAR_WIDTH : 0,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
