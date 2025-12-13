// hooks/useSearchHistory.ts
import { useEffect, useState } from "react";
import { loadSearchHistory, upsertSearchHistory } from "@/lib/Search/searchService";
import type { HistoryItem } from "@/types/search";

export function useSearchHistory(userId?: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      const data = await loadSearchHistory(userId);
      if (!mounted) return;
      setHistory(data.filter((h: any) => h.query).map((h: any) => ({ query: h.query })));
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const saveHistory = async (userIdParam: string, query: string) => {
    await upsertSearchHistory(userIdParam, query);
    // optimistic update: prepend and keep unique
    setHistory((prev) => {
      const next = [ { query }, ...prev.filter((h) => h.query !== query) ];
      return next.slice(0, 5);
    });
  };

  return { history, saveHistory };
}