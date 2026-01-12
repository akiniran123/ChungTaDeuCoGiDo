"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  MessageSquare 
} from "lucide-react";

import { useSidebarData } from "@/components/sidebarleft/hooks/useSidebarData";
import { useChat } from "@/components/MiniChat/ChatContext";
import SidebarMainNav from "./SidebarMainNav";
import MessagesPanel from "./MessagesPanel";

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
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-white shadow-sm flex-col z-40">
        <div className="mt-8 flex-1"> 
          <SidebarMainNav 
            activePanel={activePanel} 
            setActivePanel={setActivePanel} 
            unreadCount={unreadCount} 
          />
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      {/* Đã loại bỏ Bán hàng và Thông báo, chỉ giữ lại Trang chủ và Tin nhắn */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t flex items-center justify-around z-[100] px-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-gray-500">
        <button 
          onClick={() => navigateTo("/")} 
          className={`flex flex-col items-center gap-1 flex-1 ${isActive("/") ? 'text-blue-600 font-bold' : ''}`}
        >
          <Home size={22} />
          <span className="text-[10px]">Trang chủ</span>
        </button>

        <button 
          onClick={() => setActivePanel(activePanel === 'messages' ? null : 'messages')} 
          className={`relative flex flex-col items-center gap-1 flex-1 ${activePanel === 'messages' ? 'text-blue-600 font-bold' : ''}`}
        >
          <MessageSquare size={22} />
          <span className="text-[10px]">Tin nhắn</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-[30%] bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white font-bold px-1">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Panel Tin nhắn */}
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
    </>
  );
}