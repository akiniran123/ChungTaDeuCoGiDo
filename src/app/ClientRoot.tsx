"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./context/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import SidebarLayout from "./SidebarLayout";
import FirebaseInit from "@/components/FirebaseInit";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FirebaseInit />

        <Navbar />
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </CartProvider>
    </SessionProvider>
  );
}
