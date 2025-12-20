"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Edit3, Save, X } from "lucide-react";
import type { Product } from "@/types";
import type { User } from "@supabase/supabase-js";

// ==========================
// 📌 Kiểu dữ liệu User
// ==========================
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
  updated_at?: string | null;
};

// ==========================
// 📌 Form type
// ==========================
type ProfileForm = {
  username: string;
  avatar_url: string;
  address: string;
  phone: string;
  birth: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileForm>({
    username: "",
    avatar_url: "",
    address: "",
    phone: "",
    birth: "",
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ==========================
  // 📌 Load User Profile
  // ==========================
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userSession = sessionData.session?.user;

      if (!userSession) {
        setLoading(false);
        return;
      }

      setCurrentUser(userSession);

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userSession.id)
        .maybeSingle();

      if (!data) {
        setLoading(false);
        return;
      }

      const userData = data as UserData;
      setUser(userData);

      setFormData({
        username: userData.username ?? "",
        avatar_url: userData.avatar_url ?? "",
        address: userData.address ?? "",
        phone: userData.phone?.toString() ?? "",
        birth: userData.birth ?? "",
      });

      setLoading(false);
    };

    loadProfile();
  }, []);

  // ==========================
  // 📌 Load Products của User
  // ==========================
  useEffect(() => {
    if (!user) return;

    const loadProducts = async () => {
      setLoadingProducts(true);

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!data) {
        setLoadingProducts(false);
        return;
      }

      const normalized = (data as Product[]).map((p) => {
        let images: string[] = [];
        if (Array.isArray(p.images)) images = p.images;
        else if (typeof p.images === "string") {
          try {
            const parsed = JSON.parse(p.images);
            images = Array.isArray(parsed) ? parsed : [p.images];
          } catch {
            images = [p.images];
          }
        }
        return { ...p, images };
      });

      setUserProducts(normalized);
      setLoadingProducts(false);
    };

    loadProducts();
  }, [user]);

  // =========================================
  // 📌 Lưu chỉnh sửa
  // =========================================
  const handleSave = async () => {
    if (!user) return;

    const updates: Partial<UserData> = {
      username: formData.username.trim() || null,
      avatar_url: formData.avatar_url.trim() || null,
      address: formData.address.trim() || null,
      phone: formData.phone ? parseInt(formData.phone) : null,
      birth: formData.birth || null,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("users").update(updates).eq("id", user.id);

    setUser({ ...user, ...updates });
    setIsEditing(false);
  };

  // =========================================
  // 🗑️ XÓA SẢN PHẨM
  // =========================================
  const handleDelete = async (productId: string, imageUrl?: string) => {
    if (!currentUser || currentUser.id !== user?.id) return;
    if (!confirm("Bạn có chắc muốn xóa bài này?")) return;

    setDeleting(productId);

    try {
      if (imageUrl) {
        const parts = imageUrl.split("/images/");
        if (parts.length === 2) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }

      await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("user_id", currentUser.id);

      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  if (!user) return <p className="text-center py-20">Chưa đăng nhập</p>;

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Hồ sơ cá nhân</h2>

          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1"
              >
                <Save size={16} /> Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="border px-3 py-2 rounded-md text-sm flex items-center gap-1"
              >
                <X size={16} /> Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="border px-3 py-2 rounded-md text-sm flex items-center gap-1"
            >
              <Edit3 size={16} /> Chỉnh sửa
            </button>
          )}
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
            {formData.avatar_url ? (
              <Image
                src={formData.avatar_url}
                alt="avatar"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <svg
                className="w-full h-full p-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-3">
            {user.username || "Người dùng"}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* FORM */}
        <div className="mt-6 space-y-4">
          {isEditing ? (
            Object.entries({
              username: "Tên người dùng",
              avatar_url: "Avatar URL",
              address: "Địa chỉ",
              phone: "Số điện thoại",
              birth: "Ngày sinh",
            }).map(([key, label]) => {
              const typedKey = key as keyof ProfileForm;
              return (
                <div key={key}>
                  <label className="block text-sm mb-1">{label}</label>
                  <input
                    type={key === "birth" ? "date" : "text"}
                    value={formData[typedKey]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [typedKey]: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
              );
            })
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
              <p><strong>SĐT:</strong> {user.phone || "Chưa có"}</p>
              <p><strong>Ngày sinh:</strong> {user.birth || "Chưa cập nhật"}</p>
            </div>
          )}
        </div>

        {/* PRODUCTS */}
        <h3 className="text-xl font-semibold mt-10 mb-4">Sản phẩm đã đăng</h3>

        {loadingProducts ? (
          <p className="text-center">Đang tải...</p>
        ) : userProducts.length === 0 ? (
          <p className="text-center">Bạn chưa đăng sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {userProducts.map((p) => {
              const imageUrl =
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : "/no-image.jpg";

              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/deal/${p.id}`)}
                  className="border rounded-xl shadow hover:shadow-md cursor-pointer relative"
                >
                  <Image
                    src={imageUrl}
                    alt={p.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">{p.title}</h3>
                    <p className="text-sm mt-1">
                      {p.price ? p.price.toLocaleString() + "₫" : "Chưa có giá"}
                    </p>
                  </div>

                  {currentUser?.id === user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id, imageUrl);
                      }}
                      disabled={deleting === p.id}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      {deleting === p.id ? "Đang xoá..." : "Xoá"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
