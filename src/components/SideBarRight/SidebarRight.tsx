"use client";

import React from "react";
import UserMenu from "@/components/SideBarRight/UserMenu";

export default function SidebarRightCard() {
  return (
    <aside className="fixed top-[10px] right-[10px] z-30 w-[260px] h-[calc(100vh-20px)]">
      <div className="h-full rounded-4xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Phần chứa thông tin User */}
        <div className="p-4 border-b border-gray-200">
          <UserMenu />
        </div>

        {/* Phần thân bên dưới - Hiện tại để trống hoặc bạn có thể thêm các widget khác */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center py-10">
            <p className="text-xs text-gray-400 italic">
              Nội dung bổ sung sẽ được cập nhật sau
            </p>
          </div>
        </div>

        {/* Chân trang Sidebar (Tùy chọn) */}
        <div className="p-4 border-t border-gray-50 text-[10px] text-gray-400 text-center">
          © 2026 Your App Name
        </div>
      </div>
    </aside>
  );
}