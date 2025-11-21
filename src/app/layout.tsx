import "./globals.css";
import type { Metadata } from "next";
import ClientRootWrapper from "app/ClientRootWrapper";

export const metadata: Metadata = {
  title: "Jawa Clone",
  description: "Marketplace for custom PCs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black min-h-screen flex flex-col ">
        
        {/* ✅ ClientRootWrapper handles client-side rendering */}
        <ClientRootWrapper>{children}</ClientRootWrapper>
      </body>
    </html>
  );
}
