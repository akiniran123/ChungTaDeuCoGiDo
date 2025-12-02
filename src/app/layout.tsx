// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar/pc/Navbar";
import { CartProvider } from "@/app/context/CartContext";
import SidebarLeft from "@/components/Trang_chu/pc/SidebarLeft"; // ✅ sửa ở đây

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Community trading app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white min-h-screen text-black">

        <CartProvider>

          {/* NAVBAR */}
          <Navbar />

          {/* Spacer tránh navbar che */}
          <div className="h-[6.5rem]" />

          <div className="min-h-[calc(100vh-6.5rem)] flex">

            {/* SidebarLeft chạy client */}
            <SidebarLeft />   {/* ✅ ĐÚNG */}

            <main className="flex-1 ml-64">
              {children}
            </main>
          </div>

        </CartProvider>

      </body>
    </html>
  );
}
