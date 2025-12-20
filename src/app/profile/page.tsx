"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types";
import type { User } from "@supabase/supabase-js";

import ProfileHeader from "../../components/components/ProfileHeader";
import ProfileAvatar from "../../components/components/ProfileAvatar";
import ProfileForm from "../../components/components/ProfileForm";
import UserProducts from "../../components/components/UserProducts";

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

export type ProfileFormData = {
  username: string;
  avatar_url: string;
  address: string;
  phone: string;
  birth: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    avatar_url: "",
    address: "",
    phone: "",
    birth: "",
  });

  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 🔴 THIẾU STATE NÀY TRƯỚC ĐÓ
  const [deleting, setDeleting] = useState<string | null>(null);

  // ==========================
  // 📌 Load User Profile
  // ==========================
  useEffect(() => {
    const loadProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;

      if (!sessionUser) {
        setLoading(false);
        return;
      }

      setCurrentUser(sessionUser);

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (!data) {
        setLoading(false);
        return;
      }

      setUser(data as UserData);
      setFormData({
        username: data.username ?? "",
        avatar_url: data.avatar_url ?? "",
        address: data.address ?? "",
        phone: data.phone?.toString() ?? "",
        birth: data.birth ?? "",
      });

      setLoading(false);
    };

    loadProfile();
  }, []);

  // ==========================
  // 📌 Load Products
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
            images = JSON.parse(p.images);
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

  // ==========================
  // 📌 Save
  // ==========================
  const handleSave = async () => {
    if (!user) return;

    const updates: Partial<UserData> = {
      username: formData.username || null,
      avatar_url: formData.avatar_url || null,
      address: formData.address || null,
      phone: formData.phone ? parseInt(formData.phone) : null,
      birth: formData.birth || null,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("users").update(updates).eq("id", user.id);

    setUser({ ...user, ...updates });
    setIsEditing(false);
  };

  // ==========================
  // 🗑️ XÓA SẢN PHẨM (GIỮ NGUYÊN LOGIC CŨ)
  // ==========================
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
        <ProfileHeader
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />

        <ProfileAvatar user={user} avatarUrl={formData.avatar_url} />

        <ProfileForm
          isEditing={isEditing}
          user={user}
          formData={formData}
          setFormData={setFormData}
        />

        <UserProducts
          products={userProducts}
          loading={loadingProducts}
          user={user}
          currentUser={currentUser}
          router={router}
          deleting={deleting}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
// 