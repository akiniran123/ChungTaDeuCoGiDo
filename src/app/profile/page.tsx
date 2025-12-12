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

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userSession.id)
        .maybeSingle();

      if (error) console.error(error);
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

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      if (!data) {
        setLoadingProducts(false);
        return;
      }

      const products = data as Product[];
      const normalized = products.map((p) => {
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

    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (error) console.error(error);

    setUser({ ...user, ...updates });
    setIsEditing(false);
  };

  // =========================================
  // 🗑️ XÓA SẢN PHẨM (Chính chủ)
  // =========================================
  const handleDelete = async (productId: string, imageUrl?: string) => {
    if (!currentUser || currentUser.id !== user?.id) {
      alert("❌ Bạn không có quyền xóa bài này");
      return;
    }

    if (!confirm("Bạn có chắc muốn xóa bài này?")) return;

    setDeleting(productId);

    try {
      if (imageUrl) {
        const parts = imageUrl.split("/images/");
        if (parts.length === 2) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("user_id", currentUser.id);

      if (error) console.error(error);

      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );

  if (!user) return <p className="text-center py-20">Chưa đăng nhập</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* USER INFO */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Hồ sơ cá nhân</h2>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center cursor-pointer"
              >
                <Save size={16} /> Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center cursor-pointer"
              >
                <X size={16} /> Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 rounded-md text-sm flex items-center cursor-pointer border border-gray-300 hover:bg-gray-100"
            >
              <Edit3 size={16} /> Chỉnh sửa
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mt-6">
          <Image
            src={formData.avatar_url || "/default-avatar.png"}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full border shadow-md"
          />
          <h2 className="text-xl font-semibold text-gray-800 mt-2">
            {user.username || "Người dùng"}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* FORM */}
        <div className="mt-6 space-y-4">
          {isEditing ? (
            <>
              {Object.entries({
                username: "Tên người dùng",
                avatar_url: "Avatar URL",
                address: "Địa chỉ",
                phone: "Số điện thoại",
                birth: "Ngày sinh",
              }).map(([key, label]) => {
                const typedKey = key as keyof ProfileForm;
                return (
                  <div key={key}>
                    <label className="block text-sm mb-1 text-gray-600">{label}</label>
                    <input
                      type={key === "birth" ? "date" : "text"}
                      value={formData[typedKey]}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [typedKey]: e.target.value }))
                      }
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-sm text-gray-700 space-y-2">
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

        {/* USER PRODUCTS */}
        <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
          Sản phẩm đã đăng
        </h3>

        {loadingProducts ? (
          <p className="text-gray-500 text-center">Đang tải...</p>
        ) : userProducts.length === 0 ? (
          <p className="text-gray-500 text-center">Bạn chưa đăng sản phẩm nào.</p>
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
                  className="bg-white rounded-xl border shadow-sm overflow-hidden relative cursor-pointer"
                >
                  <Image
                    src={imageUrl}
                    alt={p.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm">{p.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {p.price ? p.price.toLocaleString() + "₫" : "Chưa có giá"}
                    </p>
                    {p.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>

                  {currentUser?.id === user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id, imageUrl);
                      }}
                      disabled={deleting === p.id}
                      className={`absolute top-2 right-2 px-3 py-1 rounded text-white text-xs cursor-pointer ${
                        deleting === p.id ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                      }`}
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
