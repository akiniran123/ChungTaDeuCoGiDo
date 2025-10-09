"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 🔹 Lấy session hiện tại (nếu có)
        const { data: existing } = await supabase.auth.getSession();

        // Nếu chưa có session thì lấy từ URL (Google trả về)
        if (!existing.session) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (error) {
            console.error("❌ Lỗi exchangeCodeForSession:", error);
            return;
          }
          console.log("✅ Đã tạo session từ Google:", data.session);
        }

        // 🔁 Chuyển hướng về trang trước hoặc trang chủ
        const redirect = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirect);
      } catch (err) {
        console.error("❌ Lỗi xử lý callback:", err);
        router.push("/");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      <p>Đang xử lý đăng nhập Google...</p>
    </div>
  );
}
