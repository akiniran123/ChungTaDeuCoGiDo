"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { Loader2, Edit3, Save, X } from "lucide-react";

// ==============================
// 🔹 Kiểu dữ liệu user theo Supabase
// ==============================
export type UserData = {
  id: string;
  username: string | null;
  email: string | null;
  created_at: string | null;
  avatar_url: string | null;
  karma: number | null;
  is_online: boolean | null;
  address: string | null;
  identity: number | null;
  phone: number | null;
  birth: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    avatar_url: "",
    address: "",
    phone: "",
    birth: "",
  });

  // ==============================
  // 📦 Tải thông tin người dùng
  // ==============================
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ Lỗi khi lấy session:", sessionError);
        setLoading(false);
        return;
      }

      const userSession = sessionData.session?.user;
      if (!userSession) {
        setLoading(false);
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userSession.id)
        .maybeSingle();

      if (error) {
        console.error("❌ Lỗi khi lấy user:", error);
        setLoading(false);
        return;
      }

      // 🆕 Nếu chưa có user, tạo mới
      if (!userData) {
        const username =
          userSession.email?.split("@")[0] || "user_" + userSession.id.slice(0, 8);
        const avatarUrl =
          userSession.user_metadata?.avatar_url ||
          userSession.user_metadata?.picture ||
          "/default-avatar.png";

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: userSession.id,
              username,
              email: userSession.email,
              avatar_url: avatarUrl,
              created_at: new Date().toISOString(),
              karma: 0,
              is_online: true,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("❌ Lỗi khi tạo user:", insertError);
          setLoading(false);
          return;
        }

        setUser(newUser);
        setFormData({
          username: newUser.username ?? "",
          avatar_url: newUser.avatar_url ?? "",
          address: newUser.address ?? "",
          phone: newUser.phone?.toString() ?? "",
          birth: newUser.birth ?? "",
        });
      } else {
        setUser(userData);
        setFormData({
          username: userData.username ?? "",
          avatar_url: userData.avatar_url ?? "",
          address: userData.address ?? "",
          phone: userData.phone?.toString() ?? "",
          birth: userData.birth ?? "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // ==============================
  // 💾 Lưu chỉnh sửa
  // ==============================
  const handleSave = async () => {
    if (!user) return;

    const updates = {
      username: formData.username.trim(),
      avatar_url: formData.avatar_url.trim() || null,
      address: formData.address.trim() || null,
      phone: formData.phone ? parseInt(formData.phone) : null,
      birth: formData.birth || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("users").update(updates).eq("id", user.id);

    if (error) {
      alert("❌ Lỗi khi lưu hồ sơ: " + error.message);
      return;
    }

    setUser({ ...user, ...updates });
    setIsEditing(false);
    alert("✅ Hồ sơ đã được cập nhật thành công!");
  };

  // ==============================
  // ⏳ Loading state
  // ==============================
  if (loading)
    return (
      <div className="flex justify-center items-center h-80 bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center py-20 text-gray-600 bg-gray-50">
        <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ cá nhân.</p>
      </div>
    );

  // ==============================
  // 🧩 Giao diện hiển thị hồ sơ
  // ==============================
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative border border-gray-200">
        {/* Nút chỉnh sửa ở góc phải */}
        <div className="absolute top-4 right-4">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm gap-1"
              >
                <Save size={16} /> Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm gap-1"
              >
                <X size={16} /> Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm gap-1"
            >
              <Edit3 size={16} /> Chỉnh sửa
            </button>
          )}
        </div>

        {/* Thông tin người dùng */}
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={formData.avatar_url || "/default-avatar.png"}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full border shadow-md"
          />

          <h2 className="text-2xl font-semibold text-gray-800">
            {user.username || "Người dùng"}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Form / Thông tin */}
        <div className="mt-6 space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên người dùng</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">URL ảnh đại diện</label>
                <input
                  type="text"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birth}
                  onChange={(e) =>
                    setFormData({ ...formData, birth: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {user.phone || "Chưa có"}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {user.birth || "Chưa cập nhật"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-gray-500 text-sm text-center border-t pt-4">
          <p>⭐ Điểm uy tín: {user.karma ?? 0}</p>
          <p>📅 Tham gia từ: {new Date(user.created_at || "").toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
