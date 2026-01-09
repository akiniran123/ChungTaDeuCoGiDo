import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { UserData, ProfileFormData } from "@/components/profile/type/types";
import type { Product } from "@/types";
import type { User } from "@supabase/supabase-js";

// Định nghĩa interface cho sản phẩm thô từ DB để tránh dùng any
interface RawProduct extends Omit<Product, "images"> {
  id: string;
  images: string | string[] | null;
  [key: string]: unknown; 
}

export function useProfileData(profileId: string) {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
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
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const sUser: User | null = session?.user ?? null;
      setCurrentUser(sUser);

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", profileId)
        .maybeSingle();

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

        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", profileId)
          .order("created_at", { ascending: false });
        
        // Giải quyết lỗi "Unexpected any" bằng cách ép kiểu sang RawProduct[] thay vì any[]
        const rawProds = (prods as RawProduct[] | null) ?? [];

        const normalizedProds: Product[] = rawProds.map(p => {
          let parsedImages: string[] = [];
          
          if (Array.isArray(p.images)) {
            parsedImages = p.images;
          } else if (typeof p.images === 'string') {
            try {
              parsedImages = JSON.parse(p.images);
            } catch {
              parsedImages = [];
            }
          }

          // Trả về object khớp với interface Product
          return {
            ...p,
            images: parsedImages
          } as Product;
        });

        setUserProducts(normalizedProds);
      }
      setLoading(false);
    };

    loadAllData();
  }, [profileId]);

  const toggleFollow = () => setIsFollowing((prev) => !prev);
  const isOwnProfile = currentUser?.id === profileId;

  return { 
    user, 
    setUser, 
    userProducts, 
    setUserProducts, 
    loading, 
    isOwnProfile, 
    currentUser,
    formData,
    setFormData,
    isFollowing,
    toggleFollow
  };
}