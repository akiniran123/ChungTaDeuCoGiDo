"use client";
import React from "react";

type SidebarLeftWrapperProps = {
  children?: React.ReactNode; // ✅ children giờ không bắt buộc nữa
};

export default function SidebarLeftWrapper({ children }: SidebarLeftWrapperProps) {
  return (
    <div className="h-full bg-white border-r shadow-sm">
      {children}
    </div>
  );
}

