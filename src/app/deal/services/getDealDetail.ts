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

// Kiểu trả về khi join relation users từ Supabase
type CommentWithUsersRow = Database["public"]["Tables"]["comments"]["Row"] & {
  users?: { username?: string | null; avatar_url?: string | null } | null;
};

export async function getDealDetail(id: string) {
  const supabase = await getServerClient();

  // 1️⃣ Lấy sản phẩm
  const productRes = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productRes.error || !productRes.data) {
    throw productRes.error || new Error("Không tìm thấy sản phẩm");
  }

  // Ép kiểu rõ ràng trước khi truy cập các trường
  const product = productRes.data as Product;

  // 2️⃣ Lấy tác giả
  const authorRes = await supabase
    .from("users")
    .select("*")
    .eq("id", product.user_id)
    .single();

  if (authorRes.error || !authorRes.data) {
    throw authorRes.error || new Error("Không tìm thấy tác giả");
  }

  const author = authorRes.data as User;

  // 3️⃣ Lấy comments kèm user info
  const commentsRes = await supabase
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

  if (commentsRes.error) throw commentsRes.error;

  const typedCommentsData = commentsRes.data as CommentWithUsersRow[] | null;

  const comments: CommentWithUser[] = (typedCommentsData ?? []).map((c) => ({
    id: c.id,
    product_id: c.product_id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    user: {
      username: c.users?.username ?? "Người dùng",
      avatar_url: c.users?.avatar_url ?? "/default-avatar.png",
    },
  }));

  return {
    product,
    author,
    comments,
  };
}