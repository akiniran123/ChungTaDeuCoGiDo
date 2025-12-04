"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  image_url: string | null;
  price: number | null;
}

interface HistoryItem {
  query: string;
}

interface SearchBarProps {
  userId?: string;
  onSearch?: (q: string) => void;
}

export default function SearchBar({ userId, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Lấy lịch sử tìm kiếm
  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("query")
        .eq("user_id", userId)
        .order("searched_at", { ascending: false })
        .limit(5);
      if (data) {
        setHistory(
          data.filter((h) => h.query).map((h) => ({ query: h.query as string }))
        );
      }
    };
    fetchHistory();
  }, [userId]);

  // Lấy gợi ý sản phẩm
  const fetchSuggestions = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id, title, image_url, price")
      .ilike("title", `%${query}%`)
      .limit(10);
    if (data) setResults(data);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [fetchSuggestions]);

  // Xử lý khi submit search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());

    if (userId) {
      await supabase
        .from("search_history")
        .upsert(
          [
            {
              user_id: userId,
              query: query.trim(),
              searched_at: new Date().toISOString(),
            },
          ],
          { onConflict: ["user_id", "query"] } // sửa thành mảng
        );
    }

    if (results.length > 0) {
      router.push(`/deal/${results[0].id}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center bg-white rounded-full shadow-sm border border-gray-200 px-2 h-12"
      >
        <Search size={14} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          aria-expanded={showDropdown}
          className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 h-6"
        />
      </form>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 max-h-72 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
          {loading && <p className="text-xs text-gray-400 p-2">Đang tải...</p>}
          {query && results.length > 0 && (
            <ul role="listbox" className="divide-y divide-gray-100">
              {results.map((item) => (
                <li
                  key={item.id}
                  role="option"
                  onClick={() => router.push(`/deal/${item.id}`)}
                  className="search-suggestion flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer transition-colors rounded-md"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {item.price
                        ? `${item.price.toLocaleString()}₫`
                        : "Liên hệ"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {query && !loading && results.length === 0 && (
            <p className="text-xs text-gray-500 p-2 text-center">
              Không tìm thấy sản phẩm nào
            </p>
          )}
          {!query && history.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">
                Tìm kiếm gần đây
              </p>
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(h.query)}
                  className="block w-full text-left text-xs p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {h.query}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}