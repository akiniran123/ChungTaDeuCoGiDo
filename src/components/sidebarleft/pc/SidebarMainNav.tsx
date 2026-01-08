"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  MessageSquare,
  ShoppingBag,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import LoginModal from "@/components/auth/LoginModal";

type SidebarMainNavProps = {
  setOpenMessages: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNews: React.Dispatch<React.SetStateAction<boolean>>;
  activePanel: string | null;
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>;
  unreadCount?: number;
};

export default function SidebarMainNav({
  setOpenMessages,
  setOpenNews,
  activePanel,
  setActivePanel,
  unreadCount = 0,
}: SidebarMainNavProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const requireAuth = (callback: () => void) => {
    if (!userId) {
      alert("Bạn cần đăng nhập hoặc đăng ký để sử dụng tính năng này");
      setShowLogin(true);
      return;
    }
    callback();
  };

  // 🔥 FIX TRIỆT ĐỂ: ép màu cho <a>
  const itemClass =
    "flex items-center gap-4 px-5 py-3 mx-2 rounded-xl " +
    "!text-gray-900 !visited:text-gray-900 !hover:text-gray-900 " +
    "hover:bg-gray-100 cursor-pointer";

  return (
    <>
      <nav className="mt-4 space-y-1">
        {/* Trang chủ */}
        <Link href="/" className={itemClass}>
          <Home className="w-6 h-6" />
          <span>Trang chủ</span>
        </Link>

        {/* Khám phá */}
        <Link href="/discovery" className={itemClass}>
          <Compass className="w-6 h-6" />
          <span>Khám phá</span>
        </Link>

        {/* Tin nhắn */}
        <div
          onClick={() =>
            requireAuth(() => {
              setOpenMessages((v) => !v);
              setOpenNews(false);
              setActivePanel("messages");
            })
          }
          className={`${itemClass} relative`}
        >
          <MessageSquare className="w-6 h-6" />
          <span>Tin nhắn</span>

          {unreadCount > 0 && (
            <span className="absolute right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Bán hàng */}
        <div
          onClick={() =>
            requireAuth(() => {
              router.push("/sell");
            })
          }
          className={itemClass}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Bán hàng</span>
        </div>

        {/* Thông báo */}
        <div
          onClick={() =>
            requireAuth(() => {
              setOpenNews((v) => !v);
              setOpenMessages(false);
              setActivePanel("news");
            })
          }
          className={itemClass}
        >
          <Newspaper className="w-6 h-6" />
          <span>Thông báo</span>
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
