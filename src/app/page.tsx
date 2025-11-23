// Fixed ProductsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import ProductsList from "@/components/Trang_chu/pc/ProductsList";

type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    id?: string;
    username: string | null;
    avatar_url: string | null;
  } | null;

  tags: string[]; // always string[]
  communityName?: string | null;
  communityIcon?: string | null;
};

type Badge = Database["public"]["Tables"]["badges"]["Row"];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [userBadges, setUserBadges] = useState<Record<string, Badge[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            users:user_id (
              id,
              username,
              avatar_url
            ),
            communities:community_id (
              id,
              title,
              avatar_url
            ),
            product_tags (
              tag_id,
              tags:tag_id (
                id,
                name
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const raw = (data || []) as any[];

        // Format final product object
        const formatted: ProductWithUser[] = raw.map((p) => ({
          ...p,

          users: p.users
            ? {
                id: p.users.id,
                username: p.users.username,
                avatar_url: p.users.avatar_url,
              }
            : null,

          tags:
            (p.product_tags || [])
              .map((pt: any) => pt.tags?.name)
              .filter(Boolean) || [],

          communityName: p.communities?.title || null,
          communityIcon: p.communities?.avatar_url || null,
        }));

        setProducts(formatted);

        // COMMENTS COUNT
        const commentMap: Record<string, number> = {};
        await Promise.all(
          formatted.map(async (prod) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact" })
              .eq("product_id", prod.id);

            commentMap[prod.id] = count || 0;
          })
        );
        setCommentsCount(commentMap);

        // LIKES
        const { data: likesData } = await supabase
          .from("product_likes")
          .select("product_id, user_id");

        const likeMap: Record<string, number> = {};
        const liked: string[] = [];

        likesData?.forEach((l) => {
          likeMap[l.product_id] = (likeMap[l.product_id] || 0) + 1;
        });

        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (user && likesData) {
          liked.push(
            ...likesData
              .filter((l) => l.user_id === user.id)
              .map((l) => l.product_id)
          );
        }

        setLikesCount(likeMap);
        setLikedIds(liked);

        // BADGES
        const userIds = [
          ...new Set(formatted.map((p) => p.users?.id).filter(Boolean)),
        ] as string[];

        const badgeMap: Record<string, Badge[]> = {};

        await Promise.all(
          userIds.map(async (uid) => {
            const { data: bData } = await supabase
              .from("user_badges")
              .select(
                `
                badge_id,
                badges:badge_id (
                  id,
                  name,
                  icon,
                  milestone_type,
                  milestone_value
                )
              `
              )
              .eq("user_id", uid);

            badgeMap[uid] = (bData || [])
              .map((b) => b.badges)
              .filter(Boolean);
          })
        );

        setUserBadges(badgeMap);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );

  return (
    <ProductsList
      products={products}
      likesCount={likesCount}
      commentsCount={commentsCount}
      likedIds={likedIds}
      setLikedIds={setLikedIds}
      userBadges={userBadges}
    />
  );
}
