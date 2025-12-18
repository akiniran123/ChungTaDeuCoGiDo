// src/types/products.ts
import type { Database } from "@/types/supabase";
import type { Dispatch, SetStateAction } from "react";

/**
 * UI-friendly product type:
 * - Dựa trên Row của bảng products nhưng tất cả trường DB được làm tùy chọn bằng Partial<Row>
 * - Bổ sung các trường UI-only như users, tags, communityName, mainTag, views...
 */
export type ProductWithUser = Partial<Database["public"]["Tables"]["products"]["Row"]> & {
  users?: {
    id?: string;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
  tags?: string[];
  communityNames?: string[];
  communityName?: string | null;
  communityIcon?: string | null;
  mainTag?: string | null;
  community_id?: string | null;
  views?: number | null;
};

/**
 * Narrow list item used by ProductsList (only fields the list UI needs)
 * This keeps the list component's props precise and avoids forcing the full ProductWithUser shape.
 */
export type ProductListItem = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  created_at: string;
  category: string;
  user_id?: string | null;
  users: { id: string; username: string; avatar_url: string };
  tags: string[];
  communityName: string;
  communityIcon: string;
  community_id: string;
  views: number;
  mainTag: string;
};

/** Badge row from DB (kept as-is) */
export type Badge = Database["public"]["Tables"]["badges"]["Row"];

/** Props for the ProductsList component */
export type ProductsListProps = {
  products: ProductListItem[];                 // use the narrow list item type
  likesCount: Record<string, number>;         // map productId -> likes
  commentsCount: Record<string, number>;      // map productId -> comments
  likedIds: string[];
  setLikedIds: Dispatch<SetStateAction<string[]>>;
  userBadges?: Record<string, Badge[]>;
};