import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

// 1. Định nghĩa các kiểu cơ bản từ Database
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

// 2. Tạo một kiểu trung gian để ép kiểu dữ liệu thô từ Supabase (nếu Type chưa cập nhật cột sizes)
interface ProductRaw extends ProductRow {
  sizes?: unknown;
}

type CommentWithUsersRow = CommentRow & {
  users?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

/* ======= SINGLE SOURCE OF TRUTH (Dùng cho Frontend) ======= */
export type Comment = {
  id: string;
  product_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
};

/** * Chuẩn hoá kiểu product trả về.
 * Loại bỏ images và sizes gốc để thay thế bằng kiểu mảng chuỗi đã chuẩn hóa sạch sẽ.
 */
export type ProductNormalized = Omit<ProductRow, "images" | "sizes"> & {
  images: string[] | null;
  sizes: string[] | null; 
};

export type DealDetailResult = {
  product: ProductNormalized;
  author: UserRow | null;
  comments: Comment[];
  likesCount: number;
  liked: boolean;
};
/* ========================================================== */

/** Helper: chuyển raw data (string | string[] | null) thành string[] | null */
function normalizeArrayField(raw: unknown): string[] | null {
  if (raw == null) return null;

  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      if (raw.includes(",")) {
        return raw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    const trimmed = raw.trim();
    return trimmed ? [trimmed] : null;
  }

  return null;
}

export async function getDealDetail(id: string): Promise<DealDetailResult | null> {
  /* 1. FETCH PRODUCT */
  // Ép kiểu sang ProductRaw để truy cập được trường sizes mà không bị lỗi "Property not exist"
  const { data: productRaw } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!productRaw) return null;

  const product = productRaw as ProductRaw;

  // Chuẩn hoá dữ liệu: Không còn 'any', mọi thứ được kiểm soát qua interface ProductRaw
  const normalizedProduct: ProductNormalized = {
    ...product,
    images: normalizeArrayField(product.images),
    sizes: normalizeArrayField(product.sizes), 
  };

  /* 2. FETCH AUTHOR */
  const { data: author } = await supabase
    .from("users")
    .select("*")
    .eq("id", product.user_id)
    .single<UserRow>();

  /* 3. FETCH COMMENTS */
  const { data: commentsRaw } = await supabase
    .from("comments")
    .select(`
      *,
      users ( username, avatar_url )
    `)
    .eq("product_id", id)
    .order("created_at", { ascending: true });

  const comments: Comment[] =
  (commentsRaw as CommentWithUsersRow[] | null)?.map((c) => ({
    id: c.id,
    // Add the fallback "" or handle the null case
    product_id: c.product_id ?? "", 
    user_id: c.user_id ?? "",       
    content: c.content ?? "",
    created_at: c.created_at ?? new Date().toISOString(),
    user: {
      username: c.users?.username ?? "Người dùng",
      avatar_url: c.users?.avatar_url ?? "/default-avatar.png",
    },
  })) ?? [];

  /* 4. LIKES COUNT */
  const { count } = await supabase
    .from("product_likes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);

  /* 5. CHECK IF CURRENT USER LIKED */
  const { data: auth } = await supabase.auth.getUser();
  let liked = false;

  if (auth?.user) {
    const { data: likeData } = await supabase
      .from("product_likes")
      .select("*")
      .eq("product_id", id)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    liked = !!likeData;
  }

  return {
    product: normalizedProduct,
    author,
    comments,
    likesCount: count ?? 0,
    liked,
  };
}