import { useCallback, useEffect, useState } from "react";
import {
  fetchProductsByTitle,
  fetchUsersByName,
  fetchTags,
  fetchCommunities,
  normalizeSuggestions,
} from "@/lib/Search/searchService";
import type { SuggestionItem } from "@/components/Search/types/search";

export function useSuggestions(query: string, debounceMs = 300) {
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const [products, users, tags, communities] = await Promise.all([
          fetchProductsByTitle(q, 5),
          fetchUsersByName(q, 5),
          fetchTags(q, 10),          // ✅ string[]
          fetchCommunities(q, 5),
        ]);

        const uniqueTags = Array.from(new Set(tags));

        const normalized = normalizeSuggestions({
          products,
          users,
          tags: uniqueTags,
          communities,
        });

        setResults(normalized);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      fetchAll(query);
    }, debounceMs);

    return () => clearTimeout(t);
  }, [query, debounceMs, fetchAll]);

  return { results, loading };
}
