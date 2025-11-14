// src/app/deal/[id]/services/getDealDetail.ts
"use server";

import { getServerClient } from "@/lib/supabase/serverClient";
import type { Database } from "@/types/supabase";

// Kiểu comment kèm user
export interface CommentWithUser {
  id: string;
  product_id: string;
  user_id: string;
  content: string | null;
  created_at: string | null;
  user: {
    username: string;
    avatar_url: string;
  };
}

// Kiểu product đồng bộ với DB
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];

export async function getDealDetail(id: string) {
  const supabase = await getServerClient();

  // 1️⃣ Lấy sản phẩm
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError || !product) throw productError || new Error("Không tìm thấy sản phẩm");

  // 2️⃣ Lấy tác giả
  const { data: author, error: authorError } = await supabase
    .from("users")
    .select("*")
    .eq("id", product.user_id)
    .single();

  if (authorError || !author) throw authorError || new Error("Không tìm thấy tác giả");

  // 3️⃣ Lấy comments kèm user info
  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select(`
      *,
      users (
        username,
        avatar_url
      )
    `)
    .eq("product_id", id)
    .order("created_at", { ascending: true });

  if (commentsError) throw commentsError;

  // map sang CommentWithUser với kiểu rõ ràng
  const comments: CommentWithUser[] = (commentsData || []).map((c: any) => ({
    id: c.id,
    product_id: c.product_id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    user: {
      username: c.users?.username || "Người dùng",
      avatar_url: c.users?.avatar_url || "/default-avatar.png",
    },
  }));

  return {
    product: product as Product,
    author: author as User,
    comments,
  };
}
