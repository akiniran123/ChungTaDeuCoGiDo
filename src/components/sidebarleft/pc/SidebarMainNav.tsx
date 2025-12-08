"use client";

import { useState, useEffect } from "react";
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

type SidebarMainNavProps = {
  setOpenMessages: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNews: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SidebarMainNav({
  setOpenMessages,
  setOpenNews,
}: SidebarMainNavProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const handleStartSelling = () => {
    if (userId) router.push("/protected/sell");
    else alert("Bạn cần đăng nhập trước!");
  };

  return (
    <nav className="mt-4 space-y-1">
      <Link
        href="/"
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 text-gray-900"
      >
        <Home className="w-6 h-6 text-gray-900" />
        <span className="text-gray-900">Trang chủ</span>
      </Link>

      <Link
        href="/discovery"
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 text-gray-900"
      >
        <Compass className="w-6 h-6 text-gray-900" />
        <span className="text-gray-900">Khám phá</span>
      </Link>

      <div
        onClick={() => setOpenMessages((v) => !v)}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-900"
      >
        <MessageSquare className="w-6 h-6 text-gray-900" />
        <span className="text-gray-900">Tin nhắn</span>
      </div>

      <div
        onClick={handleStartSelling}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-900"
      >
        <ShoppingBag className="w-6 h-6 text-gray-900" />
        <span className="text-gray-900">Bán hàng</span>
      </div>

      {/* Chỉnh toggle ở đây */}
      <div
        onClick={() => setOpenNews((prev) => !prev)}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-900"
      >
        <Newspaper className="w-6 h-6 text-gray-900" />
        <span className="text-gray-900">Thông báo</span>
      </div>
    </nav>
  );
}
