// components/search/SearchInput.tsx
"use client";
import React from "react";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus?: () => void;
};

export default function SearchInput({ value, onChange, onSubmit, onFocus }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center bg-white rounded-full shadow-sm border border-gray-200 px-2 h-10">
      <Search size={14} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 h-6"
      />
    </form>
  );
}