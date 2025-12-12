"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import ProductsList from "@/components/Trang_chu/pc/ProductsList";

type Badge = Database["public"]["Tables"]["badges"]["Row"];

type ProductWithUser = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;
  author_id?: string | null;
  author?: string | null;
  avatar?: string | null;
  tags: string[];
  communityName?: string | null;
  communityIcon?: string | null;
  [k: string]: unknown;
};

type RawTagRow = { id?: string; name?: string | null; title?: string | null };
type RawProductTag = {
  tag_id?: string;
  tag?: RawTagRow | { Row?: RawTagRow } | { row?: RawTagRow } | null;
  name?: string | null;
};
type RawProductRow = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;
  users?: { id?: string; username?: string | null; avatar_url?: string | null } | null;
  communities?: { id?: string; title?: string | null; avatar_url?: string | null } | null;
  product_tags?: RawProductTag[] | null;
  [k: string]: unknown;
};
type LikeRow = { product_id: string; user_id: string };
type UserBadgeRow = { badge_id: string; badges?: Badge | null };

function extractTagName(pt: RawProductTag | undefined): string | undefined {
  if (!pt) return undefined;
  if (pt.tag && typeof pt.tag === "object") {
    const t = pt.tag as RawTagRow | { Row?: RawTagRow } | { row?: RawTagRow };
    if ("name" in t && t.name) return t.name!;
    if ("title" in t && t.title) return t.title!;
    const rowCandidate = (t as { Row?: RawTagRow }).Row ?? (t as { row?: RawTagRow }).row;
    if (rowCandidate?.name) return rowCandidate.name;
    if (rowCandidate?.title) return rowCandidate.title;
  }
  if (pt.name) return pt.name;
  return undefined;
}

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
        const res = await supabase
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
              tag:tag_id ( id, name )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (res.error) throw res.error;

        const raw = res.data as RawProductRow[] | null;
        const rows: RawProductRow[] = Array.isArray(raw) ? raw : [];

        const formatted: ProductWithUser[] = rows.map((p) => {
          const tagNames = (p.product_tags ?? [])
            .map((pt) => extractTagName(pt))
            .filter((n): n is string => typeof n === "string");

          return {
            id: p.id,
            title: p.title ?? null,
            price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
            image_url: p.image_url ?? null,
            created_at: p.created_at ?? null,
            category: p.category ?? null,
            user_id: p.user_id ?? null,
            author_id: p.users?.id ?? null,
            author: p.users?.username ?? "Người dùng",
            avatar: p.users?.avatar_url || null,
            tags: tagNames,
            communityName: p.communities?.title ?? null,
            communityIcon: p.communities?.avatar_url ?? null,
          };
        });

        setProducts(formatted);

        const commentMap: Record<string, number> = {};
        await Promise.all(
          formatted.map(async (prod) => {
            const cRes = await supabase
              .from("comments")
              .select("*", { count: "exact", head: false })
              .eq("product_id", prod.id);
            const cnt =
              typeof cRes.count === "number"
                ? cRes.count
                : Array.isArray(cRes.data)
                ? cRes.data.length
                : 0;
            commentMap[prod.id] = cnt;
          })
        );
        setCommentsCount(commentMap);

        const likesRes = await supabase.from("product_likes").select("product_id, user_id");
        const likesArr: LikeRow[] | null = Array.isArray(likesRes.data)
          ? (likesRes.data as LikeRow[])
          : null;
        const likeMap: Record<string, number> = {};
        const liked: string[] = [];

        if (likesArr) {
          for (const row of likesArr) {
            likeMap[row.product_id] = (likeMap[row.product_id] || 0) + 1;
          }
        }

        const authRes = await supabase.auth.getUser();
        const user = authRes.data?.user ?? null;
        if (user && likesArr) {
          liked.push(...likesArr.filter((l) => l.user_id === user.id).map((l) => l.product_id));
        }

        setLikesCount(likeMap);
        setLikedIds(liked);

        const userIds = [...new Set(formatted.map((p) => p.author_id).filter(Boolean))] as string[];
        const badgeMap: Record<string, Badge[]> = {};

        await Promise.all(
          userIds.map(async (uid) => {
            const bRes = await supabase
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

            const arr: UserBadgeRow[] | null = Array.isArray(bRes.data)
              ? (bRes.data as UserBadgeRow[])
              : null;
            badgeMap[uid] = arr
              ? arr.map((b) => b.badges).filter((x): x is Badge => Boolean(x))
              : [];
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
    <div className="pl-6">
      <ProductsList
        products={products}
        likesCount={likesCount}
        commentsCount={commentsCount}
        likedIds={likedIds}
        setLikedIds={setLikedIds}
        userBadges={userBadges}
      />
    </div>
  );
}