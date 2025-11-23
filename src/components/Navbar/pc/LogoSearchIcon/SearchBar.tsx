"use client";

import { useEffect, useState } from "react";
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

export default function SearchBar({ userId }: { userId?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("search_history")
        .select("query")
        .eq("user_id", userId)
        .order("searched_at", { ascending: false })
        .limit(5);
      if (!error && data) {
        setHistory(data.filter((h) => h.query).map((h) => ({ query: h.query as string })));
      }
    };
    fetchHistory();
  }, [userId]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select("id, title, image_url, price")
        .ilike("title", `%${query}%`)
        .limit(10);

      if (!error && data) {
        const sorted = data.sort((a, b) => {
          const qa = a.title.toLowerCase();
          const qb = b.title.toLowerCase();
          const q = query.toLowerCase();
          if (qa === q) return -1;
          if (qb === q) return 1;
          if (qa.startsWith(q) && !qb.startsWith(q)) return -1;
          if (!qa.startsWith(q) && qb.startsWith(q)) return 1;
          return qa.localeCompare(qb);
        });
        setResults(sorted);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (userId) {
      await supabase.from("search_history").insert([
        {
          user_id: userId,
          query: query.trim(),
          searched_at: new Date().toISOString(),
        },
      ]);
    }

    if (results.length > 0) {
      router.push(`/deal/${results[0].id}`);
    }
  };

  const handleSelectHistory = (keyword: string) => {
    setQuery(keyword);
    setShowDropdown(true);
  };

  const handleSelectProduct = (id: string) => {
    setShowDropdown(false);
    router.push(`/deal/${id}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* ✅ Form tròn, bỏ toàn bộ viền xanh kể cả bên trong */}
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center bg-white rounded-full shadow-md border border-gray-200 px-4 py-2 transition-all"
        style={{ outline: "none", boxShadow: "none" }}
      >
        <Search size={20} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (!related || !related.closest(".search-suggestion")) {
              setTimeout(() => setShowDropdown(false), 150);
            }
          }}
          className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
          style={{ outline: "none", boxShadow: "none" }}
        />
      </form>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg">
          {/* Kết quả tìm kiếm */}
          {query && results.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  tabIndex={0}
                  className="search-suggestion flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors rounded-lg"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.price ? `${item.price.toLocaleString()}₫` : "Liên hệ"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Không tìm thấy */}
          {query && results.length === 0 && (
            <p className="text-sm text-gray-500 p-4 text-center">Không tìm thấy sản phẩm nào</p>
          )}

          {/* Lịch sử tìm kiếm */}
          {!query && history.length > 0 && (
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                Tìm kiếm gần đây
              </p>
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectHistory(h.query)}
                  className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
