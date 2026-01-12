"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { UserData, ProfileFormData } from "@/components/profile/type/types";
import type { User } from "@supabase/supabase-js";

export function useProfileData(profileId: string) {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    avatar_url: "",
    address: "",
    phone: "",
    birth: "",
  });

  useEffect(() => {
    const loadAllData = async () => {
      if (!profileId) return;
      
      setLoading(true);
      try {
        // 1. Lấy thông tin phiên đăng nhập hiện tại
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(session?.user ?? null);

        // 2. Chỉ lấy dữ liệu hồ sơ từ bảng users
        const { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", profileId)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          const userData = profile as UserData;
          setUser(userData);
          
          setFormData({
            username: userData.username ?? "",
            avatar_url: userData.avatar_url ?? "",
            address: userData.address ?? "",
            phone: userData.phone?.toString() ?? "",
            birth: userData.birth ?? "",
          });
        }
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu Profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [profileId]);

  const toggleFollow = () => setIsFollowing((prev) => !prev);
  const isOwnProfile = currentUser?.id === profileId;

  return { 
    user, 
    setUser, 
    loading, 
    isOwnProfile, 
    currentUser,
    formData,
    setFormData,
    isFollowing,
    toggleFollow
  };
}