import "./globals.css"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar/Navbar"
import SidebarLayout from "./SidebarLayout"
import { CartProvider } from "./context/CartContext" // ⬅️ thêm dòng này

export const metadata: Metadata = {
  title: "Jawa Clone",
  description: "Marketplace for custom PCs",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <SidebarLayout>{children}</SidebarLayout>
        </CartProvider>
      </body>
    </html>
  )
}
