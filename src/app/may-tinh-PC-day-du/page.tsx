"use client"

import React, { useState, useMemo, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { products } from "./data"
import ProductList from "./ProductList"
import FilterPanel from "./FilterPanel"
import FilterChips from "./FilterChips"

export default function PCPage() {
  const router = useRouter()
  const pathname = usePathname()

  // STATE
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [selectedCPUs, setSelectedCPUs] = useState<Set<string>>(new Set())
  const [selectedGPUs, setSelectedGPUs] = useState<Set<string>>(new Set())
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [ramMin, setRamMin] = useState<number | null>(null)
  const [ramMax, setRamMax] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "name-asc">(
    "relevance"
  )
  const [page, setPage] = useState(1)
  const perPage = 9

  // FACETS
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [])
  const types = useMemo(() => Array.from(new Set(products.map((p) => p.type))).sort(), [])
  const cpus = useMemo(() => Array.from(new Set(products.map((p) => p.cpu))).sort(), [])
  const gpus = useMemo(() => Array.from(new Set(products.map((p) => p.gpu))).sort(), [])
  const ramValues = useMemo(
    () => Array.from(new Set(products.map((p) => parseInt(p.ram)))).sort((a, b) => a - b),
    []
  )

  const priceRange = useMemo(() => {
    const values = products.map((p) => p.price)
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [])

  useEffect(() => {
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setRamMin(ramValues[0] ?? null)
    setRamMax(ramValues[ramValues.length - 1] ?? null)
  }, [priceRange, ramValues])

  const resetFilters = () => {
    setSearch("")
    setSelectedTypes(new Set())
    setSelectedBrands(new Set())
    setSelectedCPUs(new Set())
    setSelectedGPUs(new Set())
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setRamMin(ramValues[0] ?? null)
    setRamMax(ramValues[ramValues.length - 1] ?? null)
    setSortBy("relevance")
    setPage(1)
  }

  // FILTER + SORT
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return products
      .filter((p) => {
        if (s) {
          const text = `${p.name} ${p.cpu} ${p.gpu} ${p.brand}`.toLowerCase()
          if (!text.includes(s)) return false
        }
        if (selectedTypes.size > 0 && !selectedTypes.has(p.type)) return false
        if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false
        if (selectedCPUs.size > 0 && !selectedCPUs.has(p.cpu)) return false
        if (selectedGPUs.size > 0 && !selectedGPUs.has(p.gpu)) return false
        if (minPrice !== null && p.price < minPrice) return false
        if (maxPrice !== null && p.price > maxPrice) return false
        const pr = parseInt(p.ram)
        if (ramMin !== null && pr < ramMin) return false
        if (ramMax !== null && pr > ramMax) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        if (sortBy === "name-asc") return a.name.localeCompare(b.name)
        return a.id - b.id
      })
  }, [
    search,
    selectedTypes,
    selectedBrands,
    selectedCPUs,
    selectedGPUs,
    minPrice,
    maxPrice,
    ramMin,
    ramMax,
    sortBy,
  ])

  // PAGINATION
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))

  // chips
  const chips = useMemo(() => {
    const out: { key: string; label: string; onRemove: () => void }[] = []
    selectedTypes.forEach((t) =>
      out.push({
        key: `type-${t}`,
        label: t,
        onRemove: () => setSelectedTypes(new Set([...selectedTypes].filter((x) => x !== t))),
      })
    )
    selectedBrands.forEach((b) =>
      out.push({
        key: `brand-${b}`,
        label: b,
        onRemove: () => setSelectedBrands(new Set([...selectedBrands].filter((x) => x !== b))),
      })
    )
    selectedCPUs.forEach((c) =>
      out.push({
        key: `cpu-${c}`,
        label: c,
        onRemove: () => setSelectedCPUs(new Set([...selectedCPUs].filter((x) => x !== c))),
      })
    )
    selectedGPUs.forEach((g) =>
      out.push({
        key: `gpu-${g}`,
        label: g,
        onRemove: () => setSelectedGPUs(new Set([...selectedGPUs].filter((x) => x !== g))),
      })
    )
    if (search) out.unshift({ key: "q", label: `"${search}"`, onRemove: () => setSearch("") })
    return out
  }, [selectedTypes, selectedBrands, selectedCPUs, selectedGPUs, search])

  // Apply filters to URL (simple)
  const applyToUrl = () => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (selectedBrands.size) params.set("brands", Array.from(selectedBrands).join(","))
    if (selectedTypes.size) params.set("types", Array.from(selectedTypes).join(","))
    if (selectedCPUs.size) params.set("cpus", Array.from(selectedCPUs).join(","))
    if (selectedGPUs.size) params.set("gpus", Array.from(selectedGPUs).join(","))
    if (minPrice !== null) params.set("minPrice", String(minPrice))
    if (maxPrice !== null) params.set("maxPrice", String(maxPrice))
    if (ramMin !== null) params.set("ramMin", String(ramMin))
    if (ramMax !== null) params.set("ramMax", String(ramMax))
    if (sortBy) params.set("sort", sortBy)
    params.set("page", String(page))
    const url = `${pathname}?${params.toString()}`
    router.replace(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 flex gap-6">
      <FilterPanel
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        products={products}
        brands={brands}
        types={types}
        cpus={cpus}
        gpus={gpus}
        ramValues={ramValues}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedCPUs={selectedCPUs}
        setSelectedCPUs={setSelectedCPUs}
        selectedGPUs={selectedGPUs}
        setSelectedGPUs={setSelectedGPUs}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        ramMin={ramMin}
        setRamMin={setRamMin}
        ramMax={ramMax}
        setRamMax={setRamMax}
        priceRange={priceRange}
        resetFilters={resetFilters}
        applyToUrl={applyToUrl}
      />

      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm PC..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
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

        <FilterChips chips={chips} />

        <ProductList paginated={paginated} />

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 border rounded ${n === page ? "bg-[#9b4de0] text-white" : "bg-white"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
