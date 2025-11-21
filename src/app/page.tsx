"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import ProductsList from "@/components/Trang_chu/ProductsList";

type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    id?: string;
    username: string | null;
    avatar_url: string | null;
  } | null;
  tags?: string[];
  mainTag?: string | null;
  communityNames?: string[];
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
        // =========================================
        // 🟦 QUERY SẢN PHẨM + USER + TAGS
        // =========================================
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
              community_tags:tag_id (
                id,
                name,
                community_id
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const productsData = (data || []) as any[];

        // =========================================
        // 🟩 LẤY DANH SÁCH community_id TỪ TAGS
        // =========================================
        const communityIds = [
          ...new Set(
            productsData
              .flatMap((p) =>
                (p.product_tags || []).map(
                  (pt: any) => pt?.community_tags?.community_id
                )
              )
              .filter(Boolean)
          ),
        ];

        let communityMap: Record<string, string> = {};

        if (communityIds.length > 0) {
          const { data: commData } = await supabase
            .from("communities")
            .select("id, title")
            .in("id", communityIds);

          commData?.forEach((c) => {
            communityMap[c.id] = c.title;
          });
        }

        // =========================================
        // 🟨 FORMAT DATA
        // =========================================
        const formatted = productsData.map((p) => ({
          ...p,

          mainTag: null,

          tags: (p.product_tags || []).map(
            (pt: any) => pt.community_tags?.name || null
          ),

          communityNames: (p.product_tags || [])
            .map((pt: any) => communityMap[pt.community_tags?.community_id])
            .filter(Boolean),

          communityName: p.communities?.title || null,
          communityIcon: p.communities?.avatar_url || null,
        }));

        setProducts(formatted);

        // =========================================
        // 💬 COMMENTS COUNT
        // =========================================
        const commentCounts: Record<string, number> = {};

        await Promise.all(
          formatted.map(async (p) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact" })
              .eq("product_id", p.id);

            commentCounts[p.id] = count || 0;
          })
        );

        setCommentsCount(commentCounts);

        // =========================================
        // ❤️ LIKES
        // =========================================
        const { data: likesData } = await supabase
          .from("product_likes")
          .select("product_id, user_id");

        const likeCounts: Record<string, number> = {};
        const userLikes: string[] = [];

        likesData?.forEach((like) => {
          likeCounts[like.product_id] =
            (likeCounts[like.product_id] || 0) + 1;
        });

        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData.user;

        if (currentUser && likesData) {
          userLikes.push(
            ...likesData
              .filter((like) => like.user_id === currentUser.id)
              .map((like) => like.product_id)
          );
        }

        setLikesCount(likeCounts);
        setLikedIds(userLikes);

        // =========================================
        // 🏅 BADGES
        // =========================================
        const uniqueUserIds = [
          ...new Set(formatted.map((p) => p.users?.id).filter(Boolean)),
        ] as string[];

        const badgesMap: Record<string, Badge[]> = {};

        await Promise.all(
          uniqueUserIds.map(async (uid) => {
            const { data: badgeData } = await supabase
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

            if (badgeData) {
              badgesMap[uid] = badgeData
                .map((b) => b.badges)
                .filter((b): b is Badge => !!b);
            }
          })
        );

        setUserBadges(badgesMap);
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
