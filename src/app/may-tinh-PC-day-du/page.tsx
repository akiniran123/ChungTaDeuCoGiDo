"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Monitor } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import { normalizeProducts } from "@/utils/normalizeProducts";

import ProductList from "./ProductList";
import FilterPanel from "./FilterPanel";
import FilterChips from "./FilterChips";

export default function PCPage() {
  const router = useRouter();
  const pathname = usePathname();

  // STATE
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "relevance" | "price-asc" | "price-desc" | "name-asc"
  >("relevance");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // 🧠 LOAD DATA FROM SUPABASE
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "may-tinh-PC-day-du")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi khi load sản phẩm:", error.message);
        setProducts([]);
      } else {
        // ✅ Chuẩn hóa dữ liệu thật để dễ lọc/sắp xếp
        const normalized = normalizeProducts(data || []);
        setProducts(normalized);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 👉 Lấy danh sách thương hiệu (brand)
  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p: any) => p.brand || ""))
      ).filter(Boolean),
    [products]
  );

  // 👉 Lọc + tìm kiếm
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return products
      .filter((p: any) => {
        if (s && !`${p.title} ${p.description}`.toLowerCase().includes(s))
          return false;

        if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;
        if (minPrice !== null && (p.price || 0) < minPrice) return false;
        if (maxPrice !== null && (p.price || 0) > maxPrice) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "name-asc") return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [search, selectedBrands, minPrice, maxPrice, sortBy, products]);

  // 👉 Phân trang
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  // 👉 Chips lọc hiển thị trên giao diện
  const chips = useMemo(() => {
    const out: { key: string; label: string; onRemove: () => void }[] = [];

    selectedBrands.forEach((b) =>
      out.push({
        key: `brand-${b}`,
        label: b,
        onRemove: () =>
          setSelectedBrands(new Set([...selectedBrands].filter((x) => x !== b))),
      })
    );

    if (search)
      out.unshift({
        key: "q",
        label: `"${search}"`,
        onRemove: () => setSearch(""),
      });

    return out;
  }, [selectedBrands, search]);

  // 👉 Áp dụng filter lên URL (SEO-friendly)
  const applyToUrl = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedBrands.size)
      params.set("brands", Array.from(selectedBrands).join(","));
    if (minPrice !== null) params.set("minPrice", String(minPrice));
    if (maxPrice !== null) params.set("maxPrice", String(maxPrice));
    params.set("sort", sortBy);
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải sản phẩm...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 flex gap-6">
      {/* Bộ lọc bên trái */}
      <FilterPanel
  showFilter={showFilter}
  setShowFilter={setShowFilter}
  products={products}                 // ✅ thêm
  brands={brands}
  types={["gaming", "office", "workstation", "mini"]}  // ✅ tạm hardcode loại PC
  cpus={Array.from(new Set(products.map(p => p.cpu || ""))).filter(Boolean)}  // ✅
  gpus={Array.from(new Set(products.map(p => p.gpu || ""))).filter(Boolean)}  // ✅
  ramValues={[4, 8, 16, 32, 64]}     // ✅ có thể lấy từ dữ liệu thật sau
  selectedTypes={new Set()}          // ✅ nếu chưa làm loại thì để tạm trống
  setSelectedTypes={() => {}}        // ✅ placeholder
  selectedBrands={selectedBrands}
  setSelectedBrands={setSelectedBrands}
  selectedCPUs={new Set()}           // ✅ placeholder
  setSelectedCPUs={() => {}}         // ✅ placeholder
  selectedGPUs={new Set()}           // ✅ placeholder
  setSelectedGPUs={() => {}}         // ✅ placeholder
  minPrice={minPrice}
  setMinPrice={setMinPrice}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
  ramMin={null}                      // ✅ placeholder
  setRamMin={() => {}}               // ✅ placeholder
  ramMax={null}
  setRamMax={() => {}}               // ✅ placeholder
  priceRange={{ min: 0, max: 200000000 }} // ✅ ví dụ
  resetFilters={() => {
    setSearch("");
    setSelectedBrands(new Set());
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("relevance");
    setPage(1);
  }}
  applyToUrl={applyToUrl}
/>


      {/* Nội dung chính */}
      <main className="flex-1">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="w-6 h-6 text-[#9b4de0]" />
          <h1 className="text-xl font-semibold">Máy tính PC đầy đủ</h1>
        </div>

        {/* Thanh tìm kiếm + sắp xếp */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm PC..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-1/2 border rounded px-3 py-2"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-3 py-2"
          >
            <option value="relevance">Liên quan</option>
            <option value="price-asc">Giá ↑</option>
            <option value="price-desc">Giá ↓</option>
            <option value="name-asc">Tên A-Z</option>
          </select>
        </div>

        {/* Chips lọc */}
        <FilterChips chips={chips} />

        {/* Danh sách sản phẩm */}
        <ProductList
          paginated={paginated}
          onSelectProduct={(id) => router.push(`/may-tinh-PC-day-du/${id}`)}
        />

        {/* Phân trang */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 border rounded ${
                n === page ? "bg-[#9b4de0] text-white" : "bg-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
