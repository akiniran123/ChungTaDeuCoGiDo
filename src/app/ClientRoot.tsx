"use client";

import { CartProvider } from "./context/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import SidebarLayout from "./SidebarLayout";
import FirebaseInit from "@/components/FirebaseInit";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FirebaseInit />
      <Navbar />
      {/* 👇 chừa khoảng trống đúng bằng chiều cao Navbar */}
      <div>
        <SidebarLayout>{children}</SidebarLayout>
      </div>
    </CartProvider>
  );
}
