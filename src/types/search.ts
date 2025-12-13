// types/search.ts
export interface HistoryItem {
  query: string;
}

export type SuggestionType = "product" | "user" | "tag" | "community";

export interface SuggestionItem {
  type: SuggestionType;
  id: string;
  title: string;
  image?: string | null;
  price?: number | null;
}