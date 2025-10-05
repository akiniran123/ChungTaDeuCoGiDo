"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  User as UserIcon,
  LogOut,
  Mail,
  Calendar,
  Upload,
  CheckCircle2,
  Lock,
  Smartphone,
  History,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  // Các state chi tiết người dùng
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    birthday: "",
    gender: "",
    avatar_url: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      const user = data.user;
      setUser(user);
      setForm({
        full_name: user?.user_metadata?.full_name || "",
        phone: user?.user_metadata?.phone || "",
        birthday: user?.user_metadata?.birthday || "",
        gender: user?.user_metadata?.gender || "",
        avatar_url: user?.user_metadata?.avatar_url || "",
      });
      setLoading(false);
    };
    getUser();
  }, []);

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("❌ Lỗi tải ảnh: " + uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    setForm((f) => ({ ...f, avatar_url: publicUrl }));
    alert("✅ Ảnh đại diện đã được cập nhật!");
  };

  // Lưu thông tin
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { ...form },
    });
    setSaving(false);
    if (error) alert("❌ Cập nhật thất bại: " + error.message);
    else alert("✅ Cập nhật thành công!");
  };

  // Đăng xuất
  const handleSignOut = async () => {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <UserIcon className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 mb-4">Bạn chưa đăng nhập.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#9b4de0] text-white rounded-md hover:bg-[#853cc9]"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px] flex justify-center px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="relative w-28 h-28 mb-4">
            {form.avatar_url ? (
              <Image
                src={form.avatar_url}
                alt="Avatar"
                width={112}
                height={112}
                className="rounded-full object-cover border"
              />
            ) : (
              <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#9b4de0] text-white p-2 rounded-full cursor-pointer hover:bg-[#853cc9]">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {form.full_name || "Người dùng"}
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: "profile", icon: UserCircle2, label: "Thông tin cá nhân" },
            { id: "security", icon: ShieldCheck, label: "Bảo mật" },
            { id: "activity", icon: History, label: "Hoạt động gần đây" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-[#9b4de0] border-b-2 border-[#9b4de0]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nội dung từng tab */}
        <div>
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Họ và tên</label>
                  <input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, full_name: e.target.value }))
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-[#9b4de0]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Số điện thoại</label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-[#9b4de0]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Ngày sinh</label>
                  <input
                    type="date"
                    value={form.birthday}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthday: e.target.value }))
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-[#9b4de0]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Giới tính</label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, gender: e.target.value }))
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-[#9b4de0]"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`mt-4 px-4 py-2 flex items-center gap-2 bg-[#9b4de0] text-white rounded-md hover:bg-[#853cc9] ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#9b4de0]" />
                <p>Email: {user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#9b4de0]" />
                <p>
                  Tài khoản tạo ngày{" "}
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#9b4de0]" />
                <p>Thiết bị hiện tại: {navigator.userAgent}</p>
              </div>

              <button
                onClick={() =>
                  alert("Tính năng đổi mật khẩu đang được phát triển.")
                }
                className="mt-4 px-4 py-2 bg-[#9b4de0] text-white rounded-md hover:bg-[#853cc9]"
              >
                Đổi mật khẩu
              </button>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-3 text-gray-700">
              <p>📅 Đăng nhập lần cuối: 2 ngày trước</p>
              <p>🛒 Đã bình luận 3 bài đăng</p>
              <p>⭐ Đánh giá 2 sản phẩm</p>
              <p>🔐 Đổi mật khẩu cách đây 1 tháng</p>
            </div>
          )}
        </div>

        {/* Nút đăng xuất */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 flex items-center gap-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
