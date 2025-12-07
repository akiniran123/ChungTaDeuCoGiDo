"use client";

import { useEffect, useRef } from "react";
import { CartProvider } from "./context/CartContext";
import FirebaseInit from "@/components/FirebaseInit";
import AppLayout from "@/components/layouts/AppLayout";
import { usePathname, useRouter } from "next/navigation"; // ⭐ thêm

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const router = useRouter();
  const pathname = usePathname();

  // Debug logs
  console.log("🔎 ClientRootWrapper imports check:");
  console.log(" - AppLayout:", typeof AppLayout, AppLayout);
  console.log(" - FirebaseInit:", typeof FirebaseInit, FirebaseInit);

  useEffect(() => {
    console.log("🧭 ClientRootWrapper mounted (effect)");
    return () => {
      console.log("🧹 ClientRootWrapper unmounted (cleanup)");
    };
  }, []);

  // ⭐ Scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      const savedScroll = sessionStorage.getItem("scrollPosition");
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem("scrollPosition");
      }

      const handleBeforeUnload = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [pathname, router]);

  // Render diagnostics
  console.log("🔁 ClientRootWrapper render:", {
    renderCount: renderCount.current,
    childrenType: typeof children,
  });

  return (
    <CartProvider>
      <FirebaseInit />
      <AppLayout>{children}</AppLayout>
    </CartProvider>
  );
}