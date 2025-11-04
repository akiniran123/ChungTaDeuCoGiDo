"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { CartProvider } from "./context/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import SidebarLayout from "./SidebarLayout";
import FirebaseInit from "@/components/FirebaseInit";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  // ✅ Khởi tạo client Supabase cho phía browser
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    // ✅ Dùng SessionContextProvider của Supabase thay vì next-auth
    <SessionContextProvider supabaseClient={supabaseClient}>
      <CartProvider>
        <FirebaseInit />
        <Navbar />
        <SidebarLayout>{children}</SidebarLayout>
      </CartProvider>
    </SessionContextProvider>
  );
}
