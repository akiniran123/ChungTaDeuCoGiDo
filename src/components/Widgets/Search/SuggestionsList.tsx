// components/search/SuggestionsList.tsx
"use client";
import React from "react";
import Image from "next/image";
import { User, Tag, Users } from "lucide-react";
import type { SuggestionItem, HistoryItem } from "@/types/search";

type Props = {
  query: string;
  results: SuggestionItem[];
  loading: boolean;
  history: HistoryItem[];
  onSelect: (item: SuggestionItem) => void;
  onHistoryClick: (q: string) => void;
};

export default function SuggestionsList({ query, results, loading, history, onSelect, onHistoryClick }: Props) {
  return (
    <div className="absolute z-50 w-full mt-2 max-h-72 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
      {loading && <p className="text-xs text-gray-400 p-2">Đang tải...</p>}

      {query && results.length > 0 && (
        <ul role="listbox" className="divide-y divide-gray-100">
          {results.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              role="option"
              tabIndex={0}
              onClick={() => onSelect(item)}
              className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer transition-colors rounded-md"
            >
              {item.image ? (
                <div className="w-8 h-8 relative rounded-md overflow-hidden">
                  <Image src={item.image} alt={item.title} fill sizes="32px" className="object-cover" />
                </div>
              ) : (
                <>
                  {item.type === "user" && <User size={16} />}
                  {item.type === "tag" && <Tag size={16} />}
                  {item.type === "community" && <Users size={16} />}
                </>
              )}

              <div className="flex-1">
                <p className="text-xs font-medium text-gray-800">{item.title}</p>

                {item.type === "product" && <p className="text-[10px] text-gray-500">{item.price ? `${item.price.toLocaleString()}₫` : "Liên hệ"}</p>}
                {item.type === "user" && <p className="text-[10px] text-gray-500">Người dùng</p>}
                {item.type === "tag" && <p className="text-[10px] text-gray-500">Tag sản phẩm</p>}
                {item.type === "community" && <p className="text-[10px] text-gray-500">Cộng đồng</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {query && !loading && results.length === 0 && <p className="text-xs text-gray-500 p-2 text-center">Không tìm thấy kết quả</p>}

      {!query && history.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Tìm kiếm gần đây</p>
          {history.map((h, i) => (
            <button key={i} onClick={() => onHistoryClick(h.query)} className="block w-full text-left text-xs p-2 hover:bg-gray-100 rounded-md transition-colors">
              {h.query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}