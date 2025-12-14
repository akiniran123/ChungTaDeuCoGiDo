import { useCallback, useEffect, useState } from "react";
import {
  fetchProductsByTitle,
  fetchUsersByName,
  fetchTags,
  fetchCommunities,
  normalizeSuggestions,
} from "@/lib/Search/searchService";
import type { SuggestionItem } from "@/types/search";

export function useSuggestions(query: string, debounceMs = 300) {
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const [products, users, tagRows, communities] = await Promise.all([
      fetchProductsByTitle(q, 5),
      fetchUsersByName(q, 5),
      fetchTags(q, 10),
      fetchCommunities(q, 5),
    ]);

    const hasTagId = (v: unknown): v is { tag_id: string } =>
      typeof v === "object" &&
      v !== null &&
      "tag_id" in v &&
      typeof (v as { tag_id: unknown }).tag_id === "string";

    const tagIds =
      Array.isArray(tagRows) && tagRows.length > 0
        ? tagRows.filter(hasTagId).map((t) => t.tag_id)
        : [];

    const uniqueTags = Array.from(new Set(tagIds));
    const normalized = normalizeSuggestions({
      products,
      users,
      tags: uniqueTags,
      communities,
    });
    setResults(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchAll(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, fetchAll, debounceMs]);

  return { results, loading };
}