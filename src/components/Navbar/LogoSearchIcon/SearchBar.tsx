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

  // 🧩 Lấy lịch sử tìm kiếm
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
        const validHistory = data
          .filter((h) => h.query !== null)
          .map((h) => ({ query: h.query as string }));
        setHistory(validHistory);
      }
    };
    fetchHistory();
  }, [userId]);

  // 🔍 Gợi ý sản phẩm khi gõ
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, title, image_url, price")
        .ilike("title", `%${query}%`)
        .limit(10);

      if (!error && data) {
        // 🔹 Ưu tiên sản phẩm có tên bắt đầu hoặc trùng chính xác
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

    const debounceTimer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Khi nhấn Enter
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

  // 🔹 Khi click vào sản phẩm trong gợi ý
  const handleSelectProduct = (id: string) => {
    setShowDropdown(false);
    router.push(`/deal/${id}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-full shadow px-3"
      >
        <Search className="text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={(e) => {
            // ✅ Chỉ ẩn dropdown nếu không click vào gợi ý
            const related = e.relatedTarget as HTMLElement | null;
            if (!related || !related.closest(".search-suggestion")) {
              setTimeout(() => setShowDropdown(false), 150);
            }
          }}
          className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-sm"
        />
      </form>

      {showDropdown && (
        <div className="absolute z-10 bg-white border w-full rounded-md shadow mt-2 max-h-80 overflow-y-auto">
          {/* Gợi ý sản phẩm */}
          {query.length > 0 && results.length > 0 && (
            <ul>
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  tabIndex={0}
                  className="search-suggestion flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.price
                        ? `${item.price.toLocaleString()}₫`
                        : "Liên hệ"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Không tìm thấy */}
          {query.length > 0 && results.length === 0 && (
            <p className="text-sm text-gray-500 p-3">
              Không tìm thấy sản phẩm nào
            </p>
          )}

          {/* Lịch sử tìm kiếm */}
          {query.length === 0 && history.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-400 mb-2">Tìm kiếm gần đây</p>
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectHistory(h.query)}
                  className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded"
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
