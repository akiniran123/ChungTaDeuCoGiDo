"use client";

import { useState } from "react";
import SidebarLeft from "@/components/sidebarleft/components/SidebarLeft";
import SidebarRight from "@/components/SideBarRight/SidebarRight";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCategory] = useState<string | null>(null);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* SIDEBAR TRÁI: 
         - Chứa cả logic PC (Sidebar) và Mobile (BottomNav + Panels)
         - Luôn hiển thị vì nó tự quản lý Responsive bên trong
      */}
      <SidebarLeft />

      {/* NỘI DUNG CHÍNH */}
      <main
        className={`
          transition-all duration-300 min-h-screen
          /* Mobile: Không padding, cách đáy để không bị BottomNav che (pb-20) */
          px-4 py-6 pb-20 
          /* PC (md): Padding trái 256px (w-64 của SidebarLeft) */
          md:pl-64 md:pb-6
          /* PC Lớn (xl): Padding phải 300px cho SidebarRight */
          xl:pr-[300px]
        `}
      >
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* SIDEBAR PHẢI: Chỉ hiện trên màn hình lớn */}
      <aside
        className="hidden xl:block fixed right-0 top-0 bg-white border-l overflow-y-auto"
        style={{ width: 300, height: "100vh", zIndex: 30 }}
      >
        <SidebarRight selectedCategory={selectedCategory} />
      </aside>
    </div>
  );
}