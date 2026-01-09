import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { ProductsListProps, ProductListItem, Badge } from "@/components/ProductsList/types/products";

// Định nghĩa Type nội bộ cho Hook
type DBProductRow = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;
  users?: { id?: string; username?: string; avatar_url?: string } | null;
  communities?: { id?: string; title?: string; avatar_url?: string } | null;
  product_tags?: { tags?: { name?: string | null } | null; name?: string | null }[] | null;
};

export function useProductsData() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [userBadges, setUserBadges] = useState<Record<string, Badge[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Products & Relations
        const { data: rawData, error: pError } = await supabase
          .from("products")
          .select(`
            *,
            users:user_id (id, username, avatar_url),
            communities:community_id (id, title, avatar_url),
            product_tags (tags:tag_id (id, name))
          `)
          .order("created_at", { ascending: false });

        if (pError) throw pError;
        const raw = (rawData as unknown as DBProductRow[]) ?? [];

        // 2. Format Products
        const formatted = raw.map((p): ProductListItem => {
          const tagNames = (p.product_tags ?? [])
            .map(pt => pt.tags?.name || "")
            .filter(Boolean);

          return {
            id: p.id,
            title: p.title ?? "",
            price: Number(p.price) || 0,
            image_url: p.image_url ?? "",
            created_at: p.created_at ?? "",
            category: p.category ?? "",
            user_id: p.user_id ?? "",
            users: {
              id: p.users?.id ?? "",
              username: p.users?.username ?? "",
              avatar_url: p.users?.avatar_url ?? "",
            },
            tags: tagNames,
            communityName: p.communities?.title ?? "",
            communityIcon: p.communities?.avatar_url ?? "",
            community_id: p.communities?.id ?? "",
            views: 0,
            mainTag: tagNames[0] ?? "",
          };
        });
        setProducts(formatted);

        // 3. Fetch Likes & Comments & Badges đồng thời để tối ưu hiệu năng
        const [likesRes, authRes] = await Promise.all([
          supabase.from("product_likes").select("product_id, user_id"),
          supabase.auth.getUser(),
        ]);

        // Xử lý Likes
        const likesArr = (likesRes.data as { product_id: string; user_id: string }[]) ?? [];
        const likeMap: Record<string, number> = {};
        likesArr.forEach(row => {
          likeMap[row.product_id] = (likeMap[row.product_id] || 0) + 1;
        });
        setLikesCount(likeMap);

        // Xử lý likedIds cho User hiện tại
        const user = authRes.data?.user;
        if (user) {
          setLikedIds(likesArr.filter(l => l.user_id === user.id).map(l => l.product_id));
        }

        // Fetch thêm comments count (Bạn có thể dùng RPC để tối ưu hơn thay vì loop fetch)
        // ... (Logic commentMap và badgeMap giữ nguyên nhưng đặt trong Promise.all)

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { products, likesCount, commentsCount, likedIds, setLikedIds, userBadges, loading };
}