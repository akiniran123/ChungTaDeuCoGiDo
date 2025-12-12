"use client";

import SidebarLeft from "@/components/sidebarleft/pc/SidebarLeft";
import SidebarRight from "@/components/Trang_chu/pc/SidebarRight";
import BottomNav from "@/components/sidebarleft/mobile/BottomNav";

import ProductsCategoriesSearch from "@/components/Navbar/pc/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const SIDEBAR_LEFT_WIDTH = 290;
  const SIDEBAR_RIGHT_WIDTH = 300;

  const categories = ["Tất cả", "Điện thoại", "Laptop", "Thời trang", "Đồ gia dụng"];

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">

      {/* ⭐ đưa phần CategoriesSearch lên trên flex-row */}
      <div
        className="w-full bg-white border-b py-2"
        style={{
          marginLeft: SIDEBAR_LEFT_WIDTH,
          marginRight: SIDEBAR_RIGHT_WIDTH,
        }}
      >
        <ProductsCategoriesSearch
          categories={categories}
          selectedCategory={null}
          setSelectedCategory={() => {}}
        />
      </div>

      {/* ⭐ Bên dưới mới bắt đầu flex-row */}
      <div className="flex flex-1 relative">

        {/* Sidebar trái */}
        <div
          className="hidden md:block fixed left-0 bg-white"
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
          className="hidden xl:block fixed top-[4.5rem] right-0 bg-white px-4 py-6 overflow-y-auto"
          style={{
            width: SIDEBAR_RIGHT_WIDTH,
            height: "calc(100vh - 4.5rem)",
            zIndex: 30,
          }}
        >
          <SidebarRight selectedCategory={null} />
        </div>

        {/* Main content */}
        <main
          className="flex-1 px-4 py-6"
          style={{
            marginLeft: SIDEBAR_LEFT_WIDTH,
            marginRight: SIDEBAR_RIGHT_WIDTH,
          }}
        >
          {children}
        </main>

      </div>

      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
