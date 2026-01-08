"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/supabase";

import CommunityCard from "@/components/Discover/Component/CommunityCard";
import CommunityFilters from "@/components/Discover/Component/CommunityFilters";

type Community = Database["public"]["Tables"]["communities"]["Row"];

export default function CommunitiesView() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true); // Default true để tránh flash layout
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // 1. Fetch Data
  useEffect(() => {
    let mounted = true;
    const fetchCommunities = async () => {
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (mounted) {
          setCommunities(data as Community[]);
        }
      } catch (err) {
        console.error("Load communities error:", err);
        if (mounted) {
            setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCommunities();
    return () => { mounted = false; };
  }, []);

  // 2. Extract Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    communities.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [communities]);

  // 3. Filter Logic
  const filteredCommunities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return communities.filter((c) => {
      const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchQuery =
        q === "" ||
        (c.title?.toLowerCase().includes(q)) ||
        (c.description?.toLowerCase().includes(q)) ||
        (c.category?.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
  }, [communities, query, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Cộng đồng</h1>
        <p className="text-gray-600">Khám phá các cộng đồng, tham gia hoặc tạo mới.</p>
      </header>

      <CommunityFilters
        query={query}
        setQuery={setQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-3" />
            <span className="text-gray-500">Đang tải cộng đồng...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-6 border border-red-100 text-center">
             ⚠️ {error}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy cộng đồng nào.</p>
            <p className="text-gray-400 text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}