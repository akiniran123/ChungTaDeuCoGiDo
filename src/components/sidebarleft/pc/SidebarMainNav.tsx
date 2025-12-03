"use client";

import Link from "next/link";
import {
  Home, Compass, MessageSquare,
  ShoppingBag, Newspaper
} from "lucide-react";
import { toggleNewsMenu } from "@/components/Navbar/pc/LogoSearchIcon/NewsMenu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type SidebarMainNavProps = {
  setOpenMessages: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SidebarMainNav({ setOpenMessages }: SidebarMainNavProps) {
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
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100"
      >
        <Home className="w-6 h-6" />
        Trang chủ
      </Link>

      <Link
        href="/communities"
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100"
      >
        <Compass className="w-6 h-6" />
        Khám phá
      </Link>

      <div
        onClick={() => setOpenMessages((v) => !v)}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
      >
        <MessageSquare className="w-6 h-6" />
        Tin nhắn
      </div>

      <div
        onClick={handleStartSelling}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
      >
        <ShoppingBag className="w-6 h-6" />
        Bán hàng
      </div>

      <div
        onClick={() => toggleNewsMenu?.()}
        className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
      >
        <Newspaper className="w-6 h-6" />
        Thông báo
      </div>
    </nav>
  );
}
