import "./globals.css";
import type { Metadata } from "next";
import ClientRootWrapper from "./ClientRootWrapper";
import { ChatProvider } from "@/components/MiniChat/ChatContext";
import GlobalMiniChat from "@/components/MiniChat/GlobalMiniChat";

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
          <ChatProvider>
            <ClientRootWrapper>
              {children}
            </ClientRootWrapper>

            {/* Global mini chat (single instance) */}
            <GlobalMiniChat />
          </ChatProvider>
        </div>

        {/* ⭐ BẮT BUỘC cho React Portal */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}