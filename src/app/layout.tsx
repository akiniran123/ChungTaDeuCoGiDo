import "./globals.css";
import type { Metadata } from "next";
import ClientRootWrapper from "./ClientRootWrapper";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Community trading app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black min-h-screen">
        {/* App chính */}
        <div id="app-root">
          <ClientRootWrapper>{children}</ClientRootWrapper>
        </div>

        {/* ⭐ BẮT BUỘC cho React Portal */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
