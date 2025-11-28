"use client";

import { useEffect, useRef } from "react";
import { CartProvider } from "./context/CartContext";
import FirebaseInit from "@/components/FirebaseInit";
import AppLayout from "@/components/layouts/AppLayout";

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

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