"use client";

import { CartProvider } from "./context/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import SidebarLayout from "./SidebarLayout";
import FirebaseInit from "@/components/FirebaseInit";

// ❌ Không cần createBrowserSupabaseClient
// ❌ Không cần SessionContextProvider (vì bạn dùng client tự quản lý)

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FirebaseInit />
      <Navbar />
      <SidebarLayout>{children}</SidebarLayout>
    </CartProvider>
  );
}
