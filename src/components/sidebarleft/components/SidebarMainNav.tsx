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
import LoginModal from "@/components/auth/components/LoginModal";

// CẬP NHẬT TYPE: Loại bỏ 2 cái setOpen cũ
type SidebarMainNavProps = {
  activePanel: string | null;
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>;
  unreadCount?: number;
  // Giữ lại để không lỗi nếu SidebarLeft chưa kịp xóa hết tham chiếu, 
  // nhưng chúng ta sẽ không dùng tới trong logic
  setOpenMessages?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNews?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SidebarMainNav({
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

  // Logic xử lý Panel: Nếu đang mở cái này thì đóng lại, nếu không thì mở cái mới
  const togglePanel = (panelName: string) => {
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  };

  const itemClass =
    "flex items-center gap-4 px-5 py-3 mx-2 rounded-xl " +
    "!text-gray-900 !visited:text-gray-900 !hover:text-gray-900 " +
    "hover:bg-gray-100 cursor-pointer transition-colors";

  // Màu sắc khi Tab đang active
  const activeClass = "bg-gray-100 font-semibold";

  return (
    <>
      <nav className="mt-4 space-y-1">
        {/* Trang chủ - Tắt panel khi về nhà */}
        <Link href="/" className={itemClass} onClick={() => setActivePanel(null)}>
          <Home className="w-6 h-6" />
          <span>Trang chủ</span>
        </Link>

        {/* Khám phá */}
        <Link href="/discovery" className={itemClass} onClick={() => setActivePanel(null)}>
          <Compass className="w-6 h-6" />
          <span>Khám phá</span>
        </Link>

        {/* Tin nhắn */}
        <div
          onClick={() => requireAuth(() => togglePanel("messages"))}
          className={`${itemClass} relative ${activePanel === "messages" ? activeClass : ""}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span>Tin nhắn</span>
          {unreadCount > 0 && (
            <span className="absolute right-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Bán hàng */}
        <div
          onClick={() => requireAuth(() => {
            setActivePanel(null); // Đóng panel trước khi chuyển trang
            router.push("/sell");
          })}
          className={itemClass}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Bán hàng</span>
        </div>

        {/* Thông báo */}
        <div
          onClick={() => requireAuth(() => togglePanel("news"))}
          className={`${itemClass} ${activePanel === "news" ? activeClass : ""}`}
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