"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import ProductsList from "@/components/Trang_chu/ProductsList"; // ✅ sửa đúng tên file

type ProductWithUser = Database["public"]["Tables"]["products"]["Row"] & {
  users?: {
    id?: string;
    username: string | null;
    avatar_url: string | null;
  } | null;
  tags?: string[];
  communityNames?: string[];
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
        // 🧩 1️⃣ Lấy danh sách sản phẩm + user + tag + cộng đồng
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
            product_tags (
              tag_id,
              community_tags:tag_id (
                id,
                name,
                communities:community_id (
                  title
                )
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const productsData = (data || []) as any[];

        const productsWithTags = productsData.map((p) => ({
          ...p,
          tags: (p.product_tags || []).map(
            (pt: any) => pt.community_tags?.name || "Không rõ"
          ),
          communityNames: (p.product_tags || [])
            .map((pt: any) => pt.community_tags?.communities?.title)
            .filter(Boolean),
        }));

        setProducts(productsWithTags);

        // 💬 2️⃣ Lấy số lượng comment từng sản phẩm
        const commentCounts: Record<string, number> = {};
        await Promise.all(
          productsWithTags.map(async (p) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact" })
              .eq("product_id", p.id);
            commentCounts[p.id] = count || 0;
          })
        );
        setCommentsCount(commentCounts);

        // ❤️ 3️⃣ Lấy dữ liệu like
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

        // 🏅 4️⃣ Lấy huy hiệu từng user
        const uniqueUserIds = [
          ...new Set(productsWithTags.map((p) => p.users?.id).filter(Boolean)),
        ] as string[];

        const badgesMap: Record<string, Badge[]> = {};
        await Promise.all(
          uniqueUserIds.map(async (uid) => {
            const { data: badgeData, error: badgeErr } = await supabase
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

            if (!badgeErr && badgeData) {
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

  // 📦 Truyền toàn bộ dữ liệu sang component ProductsList
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
