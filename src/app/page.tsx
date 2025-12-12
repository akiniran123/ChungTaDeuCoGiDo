"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import ProductsList, {
  type ProductWithUser as PL_ProductWithUser,
  type ProductsListProps,
  type Badge as PL_Badge,
} from "@/components/Trang_chu/pc/ProductsList";

/**
 * Shape returned by the specific nested select used in this page
 * (kept narrow to satisfy TS without using `any`)
 */
type DBProductRow = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;

  users?: {
    id?: string;
    username?: string | null;
    avatar_url?: string | null;
  } | null;

  communities?: {
    id?: string;
    title?: string | null;
    avatar_url?: string | null;
  } | null;

  product_tags?: Array<
    | {
        tag_id?: string;
        tags?: { id?: string; name?: string | null } | null;
        name?: string | null;
      }
    | null
  > | null;

  // other fields may exist
  [k: string]: unknown;
};

type LikeRow = { product_id: string; user_id: string };
type UserBadgeRow = { badge_id: string; badges?: PL_Badge | null };

/**
 * IMPORTANT:
 * - Use the exported ProductWithUser type from ProductsList (aliased as PL_ProductWithUser)
 * - Use ProductsListProps["products"] for state typing so TS sees the same type instance
 */

export default function ProductsPage() {
  // use the exact products type expected by ProductsList to avoid duplicate-type mismatch
  const [products, setProducts] = useState<ProductsListProps["products"]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [userBadges, setUserBadges] = useState<Record<string, PL_Badge[]>>({});
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

        // Cast to the explicit DBProductRow[] shape (no `any`)
        const raw = (res.data as DBProductRow[] | null) ?? [];

        // Map DB row -> UI product type expected by ProductsList
        const formatted: ProductsListProps["products"] = raw.map((p) => {
          const tagNames: string[] =
            (p.product_tags ?? [])
              .map((pt) => {
                if (!pt) return undefined;
                if (pt.tags && typeof pt.tags === "object" && typeof pt.tags.name === "string") {
                  return pt.tags.name;
                }
                if (typeof pt.name === "string") return pt.name;
                return undefined;
              })
              .filter((n): n is string => Boolean(n)) ?? [];

          // Build object matching PL_ProductWithUser shape (ProductsList's exported type)
          const ui: PL_ProductWithUser = {
            // core fields from DB
            id: p.id,
            title: (p.title ?? null) as PL_ProductWithUser["title"],
            price:
              typeof p.price === "number"
                ? p.price
                : typeof p.price === "string"
                ? Number(p.price)
                : (null as PL_ProductWithUser["price"]),
            image_url: (p.image_url as string) ?? null,
            created_at: p.created_at ?? null,
            category: p.category ?? null,
            user_id: p.user_id ?? null,

            // nested user info (ProductsList's type expects `users?`)
            users: p.users
              ? {
                  id: p.users.id,
                  username: p.users.username ?? null,
                  avatar_url: p.users.avatar_url ?? null,
                }
              : null,

            // tags and community fields as defined in ProductsList's type
            tags: tagNames,
            communityName: p.communities?.title ?? null,
            communityIcon: p.communities?.avatar_url ?? null,

            // allow other unknown fields (ProductsList's type likely has index signature)
            // if your exported PL_ProductWithUser doesn't include some fields, TS will error;
            // adjust above to match exactly the exported type from ProductsList.
          } as PL_ProductWithUser;

          return ui;
        });

        setProducts(formatted);

        // comments count per product (parallel)
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

        // likes
        const likesRes = await supabase.from("product_likes").select("product_id, user_id");
        const likesArr = (Array.isArray(likesRes.data) ? (likesRes.data as LikeRow[]) : []) ?? [];
        const likeMap: Record<string, number> = {};
        const liked: string[] = [];

        for (const row of likesArr) {
          if (!row || !row.product_id) continue;
          likeMap[row.product_id] = (likeMap[row.product_id] || 0) + 1;
        }

        const authRes = await supabase.auth.getUser();
        const user = authRes.data?.user ?? null;

        if (user && likesArr.length > 0) {
          liked.push(...likesArr.filter((l) => l.user_id === user.id).map((l) => l.product_id));
        }

        setLikesCount(likeMap);
        setLikedIds(liked);

        // collect unique user ids from products
        // NOTE: ProductsList's exported ProductWithUser may not have `author_id`.
        // Use user_id (owner) or nested users.id as fallback.
        const userIds = [
          ...new Set(
            formatted
              .map((p) => p.user_id ?? p.users?.id ?? null)
              .filter((v): v is string => Boolean(v))
          ),
        ] as string[];

        const badgeMap: Record<string, PL_Badge[]> = {};

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
            badgeMap[uid] = arr.map((b) => b.badges).filter((x): x is PL_Badge => Boolean(x));
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