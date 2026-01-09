import type { Badge } from "@/components/ProductsList/types/products";

export type DBProductRow = {
  id: string;
  title?: string | null;
  price?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  user_id?: string | null;
  users?: {
    id?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
  communities?: {
    id?: string | null;
    title?: string | null;
    avatar_url?: string | null;
  } | null;
  product_tags?: {
    tags?: { id?: string; name?: string | null } | null;
    name?: string | null;
  }[] | null;
};

export type LikeRow = { product_id: string; user_id: string };
export type UserBadgeRow = { badge_id: string; badges?: Badge | null };