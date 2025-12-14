"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ProductsList from "@/components/Widgets/ProductsList/ProductsList";
import type { Badge } from "@/types/products";

type DBProductRow = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;
  users?:
    | {
        id?: string | null;
        username?: string | null;
        avatar_url?: string | null;
      }
    | null;
  communities?:
    | {
        id?: string | null;
        title?: string | null;
        avatar_url?: string | null;
      }
    | null;
  product_tags?:
    | (
        | {
            tag_id?: string;
            tags?: { id?: string; name?: string | null } | null;
            name?: string | null;
          }
        | null
      )[]
    | null;
  [k: string]: unknown;
};

type LikeRow = { product_id: string; user_id: string };
type UserBadgeRow = { badge_id: string; badges?: Badge | null };

/**
 * Narrow type used for the list view.
 * Only includes the fields the ProductsList actually needs.
 */
type ProductListItem = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  created_at: string;
  category: string;
  user_id: string;
  users: { id: string; username: string; avatar_url: string };
  tags: string[];
  communityName: string;
  communityIcon: string;
  community_id: string;
  views: number;
  mainTag: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
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
              tags:tag_id (
                id,
                name
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (res.error) throw res.error;
        const raw = (res.data as DBProductRow[] | null) ?? [];

        const formatted: ProductListItem[] = raw.map((p) => {
          const tagNames: string[] =
            (p.product_tags ?? [])
              .map((pt) => {
                if (!pt) return undefined;
                if (pt.tags?.name) return pt.tags.name;
                if (pt.name) return pt.name;
                return undefined;
              })
              .filter((n): n is string => Boolean(n)) ?? [];

          const ui: ProductListItem = {
            id: p.id,
            title: p.title ?? "",
            price:
              typeof p.price === "number"
                ? p.price
                : typeof p.price === "string"
                ? Number(p.price)
                : 0,
            image_url: p.image_url ?? "",
            created_at: p.created_at ?? "",
            category: p.category ?? "",
            user_id: p.user_id ?? "",
            users: p.users
              ? {
                  id: p.users.id ?? "",
                  username: p.users.username ?? "",
                  avatar_url: p.users.avatar_url ?? "",
                }
              : { id: "", username: "", avatar_url: "" },
            tags: tagNames,
            communityName: p.communities?.title ?? "",
            communityIcon: p.communities?.avatar_url ?? "",
            community_id: p.communities?.id ?? "",
            views: 0,
            mainTag: tagNames[0] ?? "",
          };
          return ui;
        });

        setProducts(formatted);

        const commentMap: Record<string, number> = {};
        await Promise.all(
          formatted.map(async (prod) => {
            if (!prod.id) return;

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
        const likesArr = (Array.isArray(likesRes.data) ? (likesRes.data as LikeRow[]) : []) ?? [];
        const likeMap: Record<string, number> = {};
        const liked: string[] = [];

        for (const row of likesArr) {
          if (!row?.product_id) continue;
          likeMap[row.product_id] = (likeMap[row.product_id] || 0) + 1;
        }

        const authRes = await supabase.auth.getUser();
        const user = authRes.data?.user ?? null;
        if (user) {
          liked.push(...likesArr.filter((l) => l.user_id === user.id).map((l) => l.product_id));
        }

        setLikesCount(likeMap);
        setLikedIds(liked);

        const userIds = [
          ...new Set(
            formatted
              .map((p) => p.user_id || p.users?.id || "")
              .filter((v): v is string => Boolean(v))
          ),
        ];
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

            const arr = Array.isArray(bRes.data) ? (bRes.data as UserBadgeRow[]) : [];
            badgeMap[uid] = arr.map((b) => b.badges).filter((x): x is Badge => Boolean(x));
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