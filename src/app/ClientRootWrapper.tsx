"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AppLayout from "@/components/layouts/AppLayout";

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const pathname = usePathname();

  // 1. Theo dõi vòng đời Component (Tùy chọn - có thể xóa nếu không cần debug)
  useEffect(() => {
    console.log("🚀 App initialized");
  }, []);

  // 2. Tự động khôi phục vị trí cuộn trang (Scroll Restoration)
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      // Khôi phục vị trí cũ nếu có
      const savedScroll = sessionStorage.getItem("scrollPosition");
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem("scrollPosition");
      }

      // Lưu vị trí trước khi chuyển trang hoặc đóng trình duyệt
      const handleBeforeUnload = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [pathname]);

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}