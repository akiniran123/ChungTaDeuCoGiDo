// src/hooks/Search/useSearchHistory.ts
import { useEffect, useState, useCallback } from "react";
import { loadSearchHistory, upsertSearchHistory } from "@/lib/Search/searchService";
import type { HistoryItem } from "@/components/Search/types/search";

const MAX_HISTORY = 5;
const ANON_KEY = "search_history_anonymous";

export function useSearchHistory(userId?: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const keyFor = (uid?: string) => (uid ? `search_history_${uid}` : ANON_KEY);

  useEffect(() => {
    if (!userId) {
      // load anonymous history from localStorage
      try {
        const raw = localStorage.getItem(ANON_KEY);
        setHistory(raw ? (JSON.parse(raw) as HistoryItem[]) : []);
      } catch (err) {
        console.error("load anonymous search history failed:", err);
        setHistory([]);
      }
      return;
    }

    let mounted = true;

    const hasQuery = (obj: unknown): obj is { query: string } =>
      typeof obj === "object" && obj !== null && typeof (obj as Record<string, unknown>).query === "string";

    (async () => {
      try {
        const data = await loadSearchHistory(userId);
        if (!mounted) return;

        if (!Array.isArray(data)) {
          setHistory([]);
          return;
        }

        const next = data.filter(hasQuery).map((h) => ({ query: h.query }));
        setHistory(next.slice(0, MAX_HISTORY));
      } catch (err) {
        console.error("loadSearchHistory error:", err);
        if (mounted) setHistory([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const saveHistory = useCallback(
    async (userIdParam: string | undefined, query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      // optimistic update
      setHistory((prev) => {
        const next = [{ query: trimmed }, ...prev.filter((h) => h.query !== trimmed)];
        return next.slice(0, MAX_HISTORY);
      });

      try {
        if (!userIdParam) {
          // anonymous: persist to localStorage
          const key = ANON_KEY;
          const raw = localStorage.getItem(key);
          const arr: HistoryItem[] = raw ? JSON.parse(raw) : [];
          const next = [{ query: trimmed }, ...arr.filter((h) => h.query !== trimmed)].slice(0, MAX_HISTORY);
          localStorage.setItem(key, JSON.stringify(next));
          return;
        }

        await upsertSearchHistory(userIdParam, trimmed);
      } catch (err) {
        console.error("saveHistory error:", err);
        // optional: rollback optimistic update or leave as-is
      }
    },
    []
  );

  return { history, saveHistory };
}