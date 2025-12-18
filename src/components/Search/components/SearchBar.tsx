// components/search/SearchBar.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/Search/components/SearchInput";
import SuggestionsList from "@/components/Search/components/SuggestionsList";
import { useSearchHistory } from "@/components/Search/hooks/useSearchHistory";
import { useSuggestions } from "@/components/Search/hooks/useSuggestions";
import type { SuggestionItem } from "@/components/Search/types/search";

type Props = {
  userId?: string;
  onSearch?: (q: string) => void;
};

export default function SearchBar({ userId, onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { history, saveHistory } = useSearchHistory(userId);
  const { results, loading } = useSuggestions(query);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
    if (userId) await saveHistory(userId, query.trim());
    setShowDropdown(false);
  };

  const goToItem = (item: SuggestionItem) => {
    setShowDropdown(false);
    if (item.type === "product") return router.push(`/deal/${item.id}`);
    if (item.type === "user") return router.push(`/profile/${item.id}`);
    if (item.type === "tag") return router.push(`/tag/${item.id}`);
    if (item.type === "community") return router.push(`/communities/${item.id}`);
  };

  return (
    <div className="relative w-full">
      <SearchInput
        value={query}
        onChange={(v) => {
          setQuery(v);
          onSearch?.(v);
        }}
        onSubmit={handleSubmit}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && (
        <SuggestionsList
          query={query}
          results={results}
          loading={loading}
          history={history}
          onSelect={goToItem}
          onHistoryClick={(q) => setQuery(q)}
        />
      )}
    </div>
  );
}