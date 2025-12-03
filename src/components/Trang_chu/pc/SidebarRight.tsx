"use client";
import React from "react";

export default function SidebarRightCard() {
  return (
    <aside className="fixed top-[96px] right-[28px] z-30 w-[260px] h-[calc(100vh-96px)]">
      <div className="h-full rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
        {/* Nội dung sẽ thêm sau, hiện tại để trống */}
      </div>
    </aside>
  );
}