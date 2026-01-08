import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import type { User } from "@supabase/supabase-js";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type CommunityRole = "owner" | "admin" | "mod" | "member";

type TagGroup = { 
  id: string; 
  name: string; 
  description?: string | null; 
  created_at?: string | null; 
};

export function useCommunityData(communityId: string) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminOrMod, setIsAdminOrMod] = useState(false);

  // 1. Get User
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { 
      if (data?.user) setUser(data.user); 
    });
  }, []);

  // 2. Fetch Tag Groups
  const fetchTagGroups = useCallback(async (cId: string) => {
    const { data } = await supabase
      .from("tag_groups")
      .select("id, name, description, created_at")
      .eq("community_id", cId)
      .order("created_at", { ascending: true });
    setTagGroups((data as TagGroup[]) ?? []);
  }, []);

  // 3. Fetch All Data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [commRes, prodRes, memberRes] = await Promise.all([
          supabase.from("communities").select("*").eq("id", communityId).single(),
          supabase.from("products").select("*").eq("community_id", communityId).order("created_at", { ascending: false }),
          user ? supabase.from("community_members").select("role").eq("community_id", communityId).eq("user_id", user.id).single() : Promise.resolve({ data: null })
        ]);

        if (commRes.error) throw commRes.error;
        
        setCommunity(commRes.data as Community);
        setProducts((prodRes.data as Product[]) ?? []);
        
        const role = (memberRes.data as { role: CommunityRole } | null)?.role;
        setIsAdminOrMod(!!role && ["owner", "admin", "mod"].includes(role));

        await fetchTagGroups(communityId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [communityId, user, fetchTagGroups]);

  return { community, products, tagGroups, loading, error, isAdminOrMod, fetchTagGroups };
}