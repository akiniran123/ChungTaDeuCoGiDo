import { useEffect, useState } from "react";
import { loadSearchHistory, upsertSearchHistory } from "@/lib/Search/searchService";
import type { HistoryItem } from "@/types/search";

export function useSearchHistory(userId?: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    const hasQuery = (obj: unknown): obj is { query: string } =>
      typeof obj === "object" &&
      obj !== null &&
      typeof (obj as Record<string, unknown>).query === "string";

    (async () => {
      const data = await loadSearchHistory(userId);
      if (!mounted) return;

      if (!Array.isArray(data)) {
        setHistory([]);
        return;
      }

      const next = data
        .filter(hasQuery)
        .map((h) => ({ query: h.query }));

      setHistory(next);
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const saveHistory = async (userIdParam: string, query: string) => {
    await upsertSearchHistory(userIdParam, query);
    // optimistic update: prepend and keep unique
    setHistory((prev) => {
      const next = [{ query }, ...prev.filter((h) => h.query !== query)];
      return next.slice(0, 5);
    });
  };

  return { history, saveHistory };
}