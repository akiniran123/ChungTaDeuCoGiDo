import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

type CommentWithUsersRow = CommentRow & {
  users?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

/** 👉 COMMENT TYPE DÙNG CHO UI */
export interface DealComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

/** 👉 RETURN TYPE CHUẨN */
export interface DealDetailResult {
  product: Product;
  author: UserRow | null;
  comments: DealComment[];
  likesCount: number;
  liked: boolean;
}

export async function getDealDetail(
  id: string
): Promise<DealDetailResult | null> {
  // PRODUCT
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single<Product>();

  if (!product) return null;

  // AUTHOR
  const { data: author } = await supabase
    .from("users")
    .select("*")
    .eq("id", product.user_id)
    .single<UserRow>();

  // COMMENTS
  const { data: commentsRaw } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      users ( username, avatar_url )
    `
    )
    .eq("product_id", id)
    .order("created_at", { ascending: true });

  const comments: DealComment[] =
    (commentsRaw as CommentWithUsersRow[] | null)?.map((c) => ({
      id: c.id,
      user_id: c.user_id,
      content: c.content ?? "",
      created_at: c.created_at ?? "",
      user: {
        username: c.users?.username ?? "Người dùng",
        avatar_url: c.users?.avatar_url ?? "/default-avatar.png",
      },
    })) ?? [];

  // LIKES COUNT
  const { count: likesCount } = await supabase
    .from("product_likes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);

  // CHECK USER LIKE
  const { data: auth } = await supabase.auth.getUser();
  let liked = false;

  if (auth?.user) {
    const { data } = await supabase
      .from("product_likes")
      .select("id")
      .eq("product_id", id)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    liked = !!data;
  }

  return {
    product,
    author,
    comments,
    likesCount: likesCount ?? 0,
    liked,
  };
}
