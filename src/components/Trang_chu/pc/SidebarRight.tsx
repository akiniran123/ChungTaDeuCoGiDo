"use client";
import React from "react";
import UserMenu from "@/components/Navbar/pc/LogoSearchIcon/UserMenu"; // Đường dẫn tùy thuộc vào vị trí file của bạn

export default function SidebarRightCard() {
  return (
    <aside className="fixed top-[10px] right-[10px] z-30 w-[260px] h-[calc(100vh-20px)]">
      <div className="h-full rounded-4xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* UserMenu ở đầu sidebar */}
        <div className="p-4 border-b border-gray-100">
          <UserMenu onLoginClick={() => console.log("Login clicked")} />
        </div>

        {/* Nội dung khác sẽ thêm sau */}
        <div className="flex-1 p-4">
          {/* Placeholder cho nội dung sau này */}
        </div>
      </div>
    </aside>
  );
}