import { supabase } from "@/lib/supabase/client";
import type { SuggestionItem } from "@/types/search";

export async function fetchProductsByTitle(q: string, limit = 5) {
  const { data } = await supabase
    .from("products")
    .select("id, title, image_url, price")
    .ilike("title", `%${q}%`)
    .limit(limit);
  return data ?? [];
}

export async function fetchUsersByName(q: string, limit = 5) {
  const { data } = await supabase
    .from("users")
    .select("id, username, avatar_url")
    .ilike("username", `%${q}%`)
    .limit(limit);
  return data ?? [];
}

export async function fetchTags(q: string, limit = 10) {
  const { data } = await supabase
    .from("product_tags")
    .select("tag_id")
    .ilike("tag_id", `%${q}%`)
    .limit(limit);
  return data ?? [];
}

export async function fetchCommunities(q: string, limit = 5) {
  const { data } = await supabase
    .from("communities")
    .select("id, title, banner_url")
    .ilike("title", `%${q}%`)
    .limit(limit);
  return data ?? [];
}

export async function upsertSearchHistory(userId: string, query: string) {
  return supabase.from("search_history").upsert(
    [
      {
        user_id: userId,
        query,
        searched_at: new Date().toISOString(),
      },
    ],
    { onConflict: "user_id,query" }
  );
}

export async function loadSearchHistory(userId: string, limit = 5) {
  const { data } = await supabase
    .from("search_history")
    .select("query")
    .eq("user_id", userId)
    .order("searched_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Utility to normalize raw results into SuggestionItem */
export function normalizeSuggestions({
  products,
  users,
  tags,
  communities,
}: {
  products: any[];
  users: any[];
  tags: string[];
  communities: any[];
}): SuggestionItem[] {
  const out: SuggestionItem[] = [];

  out.push(
    ...products.map((p) => ({
      type: "product" as const,
      id: p.id,
      title: p.title,
      image: p.image_url,
      price: p.price,
    }))
  );

  out.push(
    ...users.map((u) => ({
      type: "user" as const,
      id: u.id,
      title: u.username ?? "Không tên",
      image: u.avatar_url,
    }))
  );

  out.push(
    ...tags.map((t) => ({
      type: "tag" as const,
      id: t,
      title: t,
    }))
  );

  out.push(
    ...communities.map((c) => ({
      type: "community" as const,
      id: c.id,
      title: c.title ?? "Không tên",
      image: c.banner_url,
    }))
  );

  return out;
}