// src/lib/Search/searchService.ts
import { supabase } from "@/lib/supabase/client";
import type { SuggestionItem } from "@/components/Search/types/search";

/* =========================================================
   Raw DB row types (search-only, minimal & explicit)
========================================================= */

type ProductSearchRow = {
  id: string;
  title: string;
  image_url: string | null;
  price: number | null;
};

type UserSearchRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

type CommunitySearchRow = {
  id: string;
  title: string | null;
  banner_url: string | null;
};

type SearchHistoryRow = {
  query: string | null;
};

/* =========================================================
   Fetchers
========================================================= */

export async function fetchProductsByTitle(
  q: string,
  limit = 5
): Promise<ProductSearchRow[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, image_url, price")
      .ilike("title", `%${q}%`)
      .limit(limit);

    if (error) {
      console.error("fetchProductsByTitle", error);
      return [];
    }

    return (data as ProductSearchRow[]) ?? [];
  } catch (err) {
    console.error("fetchProductsByTitle exception:", err);
    return [];
  }
}

export async function fetchUsersByName(
  q: string,
  limit = 5
): Promise<UserSearchRow[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .ilike("username", `%${q}%`)
      .limit(limit);

    if (error) {
      console.error("fetchUsersByName", error);
      return [];
    }

    return (data as UserSearchRow[]) ?? [];
  } catch (err) {
    console.error("fetchUsersByName exception:", err);
    return [];
  }
}

export async function fetchTags(
  q: string,
  limit = 10
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("product_tags")
      .select("tag_id")
      .ilike("tag_id", `%${q}%`)
      .limit(limit);

    if (error) {
      console.error("fetchTags", error);
      return [];
    }

    return (
      (data as { tag_id?: unknown }[] | null)
        ?.map((r) => (r as { tag_id?: unknown }).tag_id)
        .filter((t): t is string => typeof t === "string") ?? []
    );
  } catch (err) {
    console.error("fetchTags exception:", err);
    return [];
  }
}

export async function fetchCommunities(
  q: string,
  limit = 5
): Promise<CommunitySearchRow[]> {
  try {
    const { data, error } = await supabase
      .from("communities")
      .select("id, title, banner_url")
      .ilike("title", `%${q}%`)
      .limit(limit);

    if (error) {
      console.error("fetchCommunities", error);
      return [];
    }

    return (data as CommunitySearchRow[]) ?? [];
  } catch (err) {
    console.error("fetchCommunities exception:", err);
    return [];
  }
}

/* =========================================================
   Search history
========================================================= */

export async function upsertSearchHistory(
  userId: string,
  query: string
) {
  if (!userId || typeof userId !== "string") {
    console.error("upsertSearchHistory called with invalid userId:", userId);
    console.trace("upsertSearchHistory call trace");
    return null;
  }

  try {
    const res = await supabase.from("search_history").upsert(
      [
        {
          user_id: userId,
          query,
          searched_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id,query" }
    );

    if (res.error) {
      console.error("upsertSearchHistory error:", res.error);
    }

    return res;
  } catch (err) {
    console.error("upsertSearchHistory exception:", err);
    return null;
  }
}

/**
 * Load search history
 * - Filter null
 * - Return UI-safe { query: string }
 */
export async function loadSearchHistory(
  userId: string,
  limit = 5
): Promise<{ query: string }[]> {
  if (!userId || typeof userId !== "string") {
    console.error("loadSearchHistory called with invalid userId:", userId);
    console.trace("loadSearchHistory call trace");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("search_history")
      .select("query")
      .eq("user_id", userId)
      .order("searched_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("loadSearchHistory", error);
      return [];
    }

    return (
      (data as SearchHistoryRow[] | null)
        ?.map((r) => r.query)
        .filter((q): q is string => typeof q === "string")
        .map((q) => ({ query: q })) ?? []
    );
  } catch (err) {
    console.error("loadSearchHistory exception:", err);
    return [];
  }
}

/* =========================================================
   Normalize to SuggestionItem (DISCRIMINATED UNION SAFE)
========================================================= */

export function normalizeSuggestions({
  products,
  users,
  tags,
  communities,
}: {
  products: ProductSearchRow[];
  users: UserSearchRow[];
  tags: string[];
  communities: CommunitySearchRow[];
}): SuggestionItem[] {
  const out: SuggestionItem[] = [];

  out.push(
    ...products.map(
      (p) =>
        ({
          type: "product",
          id: p.id,
          title: p.title,
          image: p.image_url ?? undefined,
          price: p.price ?? undefined,
        }) satisfies SuggestionItem
    )
  );

  out.push(
    ...users.map(
      (u) =>
        ({
          type: "user",
          id: u.id,
          title: u.username ?? "Không tên",
          image: u.avatar_url ?? undefined,
        }) satisfies SuggestionItem
    )
  );

  out.push(
    ...tags.map(
      (t) =>
        ({
          type: "tag",
          id: t,
          title: t,
        }) satisfies SuggestionItem
    )
  );

  out.push(
    ...communities.map(
      (c) =>
        ({
          type: "community",
          id: c.id,
          title: c.title ?? "Không tên",
          image: c.banner_url ?? undefined,
        }) satisfies SuggestionItem
    )
  );

  return out;
}