"use client"

import React, { useState, useMemo } from "react"
import { NormalizedProduct } from "@/utils/normalizeProducts" // ✅ import kiểu đúng
import { fmt } from "./utils"

type Props = {
  showFilter: boolean
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
  products: NormalizedProduct[] // ✅ dùng kiểu có brand/cpu/gpu/ram
  brands: string[]
  types: string[]
  cpus: string[]
  gpus: string[]
  ramValues: number[]
  selectedTypes: Set<string>
  setSelectedTypes: React.Dispatch<React.SetStateAction<Set<string>>>
  selectedBrands: Set<string>
  setSelectedBrands: React.Dispatch<React.SetStateAction<Set<string>>>
  selectedCPUs: Set<string>
  setSelectedCPUs: React.Dispatch<React.SetStateAction<Set<string>>>
  selectedGPUs: Set<string>
  setSelectedGPUs: React.Dispatch<React.SetStateAction<Set<string>>>
  minPrice: number | null
  setMinPrice: (v: number | null) => void
  maxPrice: number | null
  setMaxPrice: (v: number | null) => void
  ramMin: number | null
  setRamMin: (v: number | null) => void
  ramMax: number | null
  setRamMax: (v: number | null) => void
  priceRange: { min: number; max: number }
  resetFilters: () => void
  applyToUrl?: () => void
}

export default function FilterPanel({
  showFilter,
  setShowFilter,
  products,
  brands,
  types,
  cpus,
  gpus,
  ramValues,
  selectedTypes,
  setSelectedTypes,
  selectedBrands,
  setSelectedBrands,
  selectedCPUs,
  setSelectedCPUs,
  selectedGPUs,
  setSelectedGPUs,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  ramMin,
  setRamMin,
  ramMax,
  setRamMax,
  priceRange,
  resetFilters,
  applyToUrl,
}: Props) {
  const [brandQuery, setBrandQuery] = useState("")
  const [cpuQuery, setCpuQuery] = useState("")
  const [gpuQuery, setGpuQuery] = useState("")

  // ✅ Đếm số lượng sản phẩm theo thuộc tính
  const counts = useMemo(() => {
    const map = {
      brand: new Map<string, number>(),
      cpu: new Map<string, number>(),
      gpu: new Map<string, number>(),
      ram: new Map<number, number>(),
    }

    for (const p of products) {
      const brand = p.brand ?? "" // ✅ fallback rỗng để không lỗi type
      const cpu = p.cpu ?? ""
      const gpu = p.gpu ?? ""
      const ramValue =
        typeof p.ram === "string" ? parseInt(p.ram, 10) : p.ram ?? 0

      if (brand) map.brand.set(brand, (map.brand.get(brand) ?? 0) + 1)
      if (cpu) map.cpu.set(cpu, (map.cpu.get(cpu) ?? 0) + 1)
      if (gpu) map.gpu.set(gpu, (map.gpu.get(gpu) ?? 0) + 1)
      if (!isNaN(ramValue) && ramValue > 0)
        map.ram.set(ramValue, (map.ram.get(ramValue) ?? 0) + 1)
    }

    return map
  }, [products])

  const toggleSet = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setFn((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  const visibleBrands = brandQuery
    ? brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))
    : brands
  const visibleCPUs = cpuQuery
    ? cpus.filter((c) => c.toLowerCase().includes(cpuQuery.toLowerCase()))
    : cpus
  const visibleGPUs = gpuQuery
    ? gpus.filter((g) => g.toLowerCase().includes(gpuQuery.toLowerCase()))
    : gpus

  return (
    <aside className="hidden md:block w-72 shrink-0" aria-label="Bộ lọc sản phẩm">
      <div className="border rounded-lg p-4 bg-white shadow-sm sticky top-24">
        <h4 className="font-semibold mb-3">Bộ lọc</h4>

        {/* Types */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Loại</div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => toggleSet(setSelectedTypes, t)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedTypes.has(t)
                    ? "bg-[#9b4de0] text-white border-[#9b4de0]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {t === "gaming"
                  ? "PC Gaming"
                  : t === "office"
                  ? "Văn phòng"
                  : t === "workstation"
                  ? "Workstation"
                  : "Mini PC"}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Hãng</div>
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Tìm hãng..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-36 overflow-auto gap-1">
            {visibleBrands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(b)}
                  onChange={() => toggleSet(setSelectedBrands, b)}
                />
                <span className="truncate">{b}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({counts.brand.get(b) ?? 0})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* CPU */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">CPU</div>
          <input
            value={cpuQuery}
            onChange={(e) => setCpuQuery(e.target.value)}
            placeholder="Tìm CPU..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-40 overflow-auto gap-1">
            {visibleCPUs.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCPUs.has(c)}
                  onChange={() => toggleSet(setSelectedCPUs, c)}
                />
                <span>{c}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({counts.cpu.get(c) ?? 0})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* GPU */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">GPU</div>
          <input
            value={gpuQuery}
            onChange={(e) => setGpuQuery(e.target.value)}
            placeholder="Tìm GPU..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-40 overflow-auto gap-1">
            {visibleGPUs.map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGPUs.has(g)}
                  onChange={() => toggleSet(setSelectedGPUs, g)}
                />
                <span>{g}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({counts.gpu.get(g) ?? 0})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">RAM (GB)</div>
          <div className="flex items-center gap-2">
            <select
              value={ramMin ?? ""}
              onChange={(e) => setRamMin(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1"
            >
              <option value="">Min</option>
              {ramValues.map((r) => (
                <option key={r} value={r}>
                  {r}GB
                </option>
              ))}
            </select>
            <span>-</span>
            <select
              value={ramMax ?? ""}
              onChange={(e) => setRamMax(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1"
            >
              <option value="">Max</option>
              {ramValues.map((r) => (
                <option key={r} value={r}>
                  {r}GB
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Giá */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Giá</div>
            <div className="text-xs text-gray-400">
              {fmt(minPrice ?? priceRange.min)} - {fmt(maxPrice ?? priceRange.max)}
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(Number(e.target.value) || null)}
              className="w-1/2 border rounded px-2 py-1"
            />
            <input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(Number(e.target.value) || null)}
              className="w-1/2 border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            resetFilters()
            applyToUrl?.()
          }}
          className="w-full px-3 py-2 border rounded bg-white"
        >
          Reset
        </button>
      </div>
    </aside>
  )
}
