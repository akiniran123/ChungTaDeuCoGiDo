"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Search, Filter } from "lucide-react";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filtered, setFiltered] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!mounted) return;
        setCommunities(data ?? []);
      } catch (err: any) {
        console.error("Load communities error:", err);
        setError(err?.message ?? "Lỗi khi tải danh sách cộng đồng");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    communities.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [communities]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const arr = communities.filter((c) => {
      const matchCategory =
        selectedCategory === "All" || c.category === selectedCategory;
      const matchQuery =
        q === "" ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
    setFiltered(arr);
  }, [communities, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Cộng đồng
          </h1>
          <p className="text-gray-600">
            Khám phá các cộng đồng, tham gia hoặc tạo mới.
          </p>
        </header>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, mô tả hoặc chủ đề..."
                className="w-full outline-none p-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <main>
          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-center">
              <Loader2 className="animate-spin w-6 h-6 mr-3 text-blue-600" />
              <span className="text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 rounded-2xl p-6">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-500">
              Không tìm thấy cộng đồng nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <Link
                  key={c.id}
                  href={`/communities/${c.id}`}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                      {c.title ? c.title.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {c.title || "Không tên"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {c.description || "Chưa có mô tả."}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>{c.category || "Khác"}</span>
                        <span>·</span>
                        <span>👥 {c.members_count ?? 0}</span>
                        <span>·</span>
                        <span>🟢 {c.online_count ?? 0} online</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}