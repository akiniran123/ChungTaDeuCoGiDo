"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToUserProfile = async () => {
      console.log("🟢 Kiểm tra session...");
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Lỗi khi lấy session:", error);
        setLoading(false);
        return;
      }

      const user = session?.user;
      console.log("📦 Session hiện tại:", session);
      if (!user) {
        console.log("⚠️ Chưa đăng nhập");
        setLoading(false);
        return;
      }

      console.log("✅ Đã có user:", user.id);

      // ==========================
      // 🔍 Kiểm tra user trong bảng
      // ==========================
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Lỗi khi lấy user:", fetchError);
        setLoading(false);
        return;
      }

      if (!userData) {
        // ==========================
        // 🆕 Không có user → tạo mới
        // ==========================
        console.log("🆕 Không có user — tiến hành tạo mới...");

        const username =
          user.email?.split("@")[0] || "user_" + user.id.slice(0, 8);
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "/default-avatar.png";

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: user.id,
            username,
            email: user.email,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString(),
            karma: 0,
            is_online: true,
          },
        ]);

        if (insertError) {
          console.error("❌ Lỗi khi tạo user mới:", insertError);
          alert(JSON.stringify(insertError, null, 2)); // hiện lỗi chi tiết
          setLoading(false);
          return;
        }

        console.log("✅ Tạo user mới thành công!");
        console.log("➡️ Redirect đến /user/" + username);
        router.push(`/user/${username}`);
        return;
      }

      // ==========================
      // 👤 User đã tồn tại → update trạng thái
      // ==========================
      console.log("👤 User đã tồn tại — cập nhật trạng thái online...");

      const { error: updateError } = await supabase
        .from("users")
        .update({ is_online: true })
        .eq("id", user.id);

      if (updateError) {
        console.error("⚠️ Lỗi khi cập nhật user:", updateError);
        setLoading(false);
        return;
      }

      console.log("✅ Cập nhật user thành công!");
      console.log("➡️ Redirect đến /user/" + userData.username);
      router.push(`/user/${userData.username}`);
    };

    redirectToUserProfile();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="text-center py-20 text-gray-600">
      <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ cá nhân.</p>
    </div>
  );
}
