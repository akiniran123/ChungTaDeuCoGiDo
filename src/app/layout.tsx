// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ClientRootWrapper from "./ClientRootWrapper"; // thêm import

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Community trading app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black min-h-screen">
        {/* Bao toàn bộ app bằng ClientRootWrapper */}
        <ClientRootWrapper>{children}</ClientRootWrapper>
      </body>
    </html>
  );
}