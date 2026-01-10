"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  MessageSquare, 
  ShoppingBag, 
  Newspaper 
} from "lucide-react";

import { useSidebarData } from "@/components/sidebarleft/hooks/useSidebarData";
import { useChat } from "@/components/MiniChat/ChatContext";
import SidebarMainNav from "./SidebarMainNav";
import SidebarCommunity from "./SidebarCommunity";
import MessagesPanel from "./MessagesPanel";
import NewsPanel from "./NewsPanel";
import Logo from "@/components/sidebarleft/components/logo";

export default function SidebarLeft() {
  const { conversations, unreadCount, clearUnread } = useSidebarData();
  const { openChat } = useChat();
  const router = useRouter();
  const pathname = usePathname();
  
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const navigateTo = (path: string) => {
    setActivePanel(null);
    router.push(path);
  };

  const isActive = (path: string) => pathname === path && !activePanel;

  return (
    <>
      {/* --- PC SIDEBAR --- */}
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-white shadow-sm flex-col z-40 ">
        <div className="mt-6 mb-4 px-4"><Logo /></div>
        <SidebarMainNav 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
          unreadCount={unreadCount} 
        />
        <SidebarCommunity />
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t flex items-center justify-around z-[100] px-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-gray-500">
        <button onClick={() => navigateTo("/")} className={`flex flex-col items-center gap-1 ${isActive("/") ? 'text-blue-600' : ''}`}>
          <Home size={22} />
          <span className="text-[10px] font-medium">Trang chủ</span>
        </button>

        <button onClick={() => navigateTo("/discovery")} className={`flex flex-col items-center gap-1 ${isActive("/discovery") ? 'text-blue-600' : ''}`}>
          <Compass size={22} />
          <span className="text-[10px] font-medium">Khám phá</span>
        </button>

        <button onClick={() => navigateTo("/sell")} className={`flex flex-col items-center gap-1 ${isActive("/sell") ? 'text-blue-600' : ''}`}>
          <ShoppingBag size={22} />
          <span className="text-[10px] font-medium">Bán hàng</span>
        </button>

        <button 
          onClick={() => setActivePanel(activePanel === 'messages' ? null : 'messages')} 
          className={`relative flex flex-col items-center gap-1 ${activePanel === 'messages' ? 'text-blue-600' : ''}`}
        >
          <MessageSquare size={22} />
          <span className="text-[10px] font-medium">Tin nhắn</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white font-bold px-1">
              {unreadCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActivePanel(activePanel === 'news' ? null : 'news')} 
          className={`flex flex-col items-center gap-1 ${activePanel === 'news' ? 'text-blue-600' : ''}`}
        >
          <Newspaper size={22} />
          <span className="text-[10px] font-medium">Thông báo</span>
        </button>
      </nav>

      {/* --- CÁC PANEL (PHẢI CÓ ĐOẠN NÀY MỚI HIỆN ĐƯỢC BẢNG) --- */}
      <MessagesPanel
        open={activePanel === "messages"}
        setOpen={(val) => setActivePanel(val ? "messages" : null)}
        conversations={conversations}
        onSelect={(id) => { 
          openChat(id); 
          clearUnread(id); 
          setActivePanel(null); 
        }}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        clearUnread={clearUnread}
      />

      <NewsPanel
        open={activePanel === "news"}
        setOpen={(val) => setActivePanel(val ? "news" : null)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
    </>
  );
}