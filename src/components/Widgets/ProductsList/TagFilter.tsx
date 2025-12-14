// components/Trang_chu/pc/TagFilter.tsx
import React from "react";

export type TagFilterProps = {
  activeTag: string | null;
  onClear: () => void;
};

export function TagFilter({ activeTag, onClear }: TagFilterProps) {
  if (!activeTag) return null;
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm cursor-pointer select-none">
        Đang lọc theo tag:
        <strong className="ml-1 text-pink-600">#{activeTag}</strong>
      </span>
      <button
        onClick={onClear}
        className="cursor-pointer px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
      >
        Hủy lọc
      </button>
    </div>
  );
}

export default TagFilter;