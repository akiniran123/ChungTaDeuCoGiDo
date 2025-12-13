// hooks/useSuggestions.ts
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

    const uniqueTags = Array.from(new Set(tagRows.map((t: any) => t.tag_id)));
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