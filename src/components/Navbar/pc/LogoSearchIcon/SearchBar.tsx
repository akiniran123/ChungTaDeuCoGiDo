"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, User, Tag, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  image_url: string | null;
  price: number | null;
  tags: string | null;
}

interface UserItem {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface Community {
  id: string;
  title: string;
  banner_url: string | null;
}

interface HistoryItem {
  query: string;
}

interface SuggestionItem {
  type: "product" | "user" | "tag" | "community";
  id: string;
  title: string;
  image?: string | null;
  price?: number | null;
}

interface SearchBarProps {
  userId?: string;
  onSearch?: (q: string) => void;
}

export default function SearchBar({ userId, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load history
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

  // Fetch suggestions
  const fetchSuggestions = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    let finalResults: SuggestionItem[] = [];

    // 1️⃣ Products
    const { data: productData } = await supabase
      .from("products")
      .select("id, title, image_url, price, tags")
      .ilike("title", `%${query}%`)
      .limit(5);

    if (productData) {
      finalResults.push(
        ...productData.map((p) => ({
          type: "product" as const,
          id: p.id,
          title: p.title,
          image: p.image_url,
          price: p.price,
        }))
      );
    }

    // 2️⃣ Users
    const { data: userData } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .ilike("username", `%${query}%`)
      .limit(5);

    if (userData) {
      finalResults.push(
        ...userData.map((u) => ({
          type: "user" as const,
          id: u.id,
          title: u.username ?? "Không tên",
          image: u.avatar_url,
        }))
      );
    }

    // ⭐ 3️⃣ TÌM TAG SẢN PHẨM — CHỈ CHỈNH MỤC NÀY
    const { data: allProducts } = await supabase
      .from("products")
      .select("id, tags")
      .limit(1000); // đảm bảo có đủ tags để lọc

    if (allProducts) {
      const searchLower = query.toLowerCase();
      const tagSet = new Set<string>();

      allProducts.forEach((p) => {
        if (!p.tags) return;

        p.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.toLowerCase().includes(searchLower)) // lọc partial trong tag
          .forEach((t) => tagSet.add(t));
      });

      const tagResults = Array.from(tagSet)
        .slice(0, 5)
        .map((tag) => ({
          type: "tag" as const,
          id: tag,
          title: tag,
        }));

      finalResults.push(...tagResults);
    }

    // 4️⃣ Communities
    const { data: communityData } = await supabase
      .from("communities")
      .select("id, title, banner_url")
      .ilike("title", `%${query}%`)
      .limit(5);

    if (communityData) {
      finalResults.push(
        ...communityData.map((c) => ({
          type: "community" as const,
          id: c.id,
          title: c.title ?? "Không tên",
          image: c.banner_url,
        }))
      );
    }

    setResults(finalResults);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [fetchSuggestions]);

  // Search submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());

    if (userId) {
      await supabase.from("search_history").upsert(
        [
          {
            user_id: userId,
            query: query.trim(),
            searched_at: new Date().toISOString(),
          },
        ],
        { onConflict: "user_id,query" }
      );
    }
  };

  const goToItem = (item: SuggestionItem) => {
    setShowDropdown(false);

    if (item.type === "product") return router.push(`/deal/${item.id}`);
    if (item.type === "user") return router.push(`/profile/${item.id}`);

    // ⭐ ROUTE TAG
    if (item.type === "tag") return router.push(`/tag/${item.title}`);

    if (item.type === "community") return router.push(`/communities/${item.id}`);
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
          className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 h-6"
        />
      </form>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 max-h-72 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
          {loading && <p className="text-xs text-gray-400 p-2">Đang tải...</p>}

          {query && results.length > 0 && (
            <ul role="listbox" className="divide-y divide-gray-100">
              {results.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  role="option"
                  onClick={() => goToItem(item)}
                  className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer transition-colors rounded-md"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                  ) : (
                    <>
                      {item.type === "user" && <User size={16} />}
                      {item.type === "tag" && <Tag size={16} />}
                      {item.type === "community" && <Users size={16} />}
                    </>
                  )}

                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">
                      {item.title}
                    </p>

                    {item.type === "product" && (
                      <p className="text-[10px] text-gray-500">
                        {item.price
                          ? `${item.price.toLocaleString()}₫`
                          : "Liên hệ"}
                      </p>
                    )}

                    {item.type === "user" && (
                      <p className="text-[10px] text-gray-500">Người dùng</p>
                    )}

                    {item.type === "tag" && (
                      <p className="text-[10px] text-gray-500">Tag sản phẩm</p>
                    )}

                    {item.type === "community" && (
                      <p className="text-[10px] text-gray-500">Cộng đồng</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {query && !loading && results.length === 0 && (
            <p className="text-xs text-gray-500 p-2 text-center">
              Không tìm thấy kết quả
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
