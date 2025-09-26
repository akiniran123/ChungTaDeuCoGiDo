"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Product } from "./types"
import { fmt } from "./utils"

type Props = {
  showFilter: boolean
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
  products: Product[]
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
  applyToUrl: () => void
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
  // local state
  const [localTypes, setLocalTypes] = useState(new Set(selectedTypes))
  const [localBrands, setLocalBrands] = useState(new Set(selectedBrands))
  const [localCPUs, setLocalCPUs] = useState(new Set(selectedCPUs))
  const [localGPUs, setLocalGPUs] = useState(new Set(selectedGPUs))
  const [localMinPrice, setLocalMinPrice] = useState(minPrice ?? priceRange.min)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice ?? priceRange.max)
  const [localRamMin, setLocalRamMin] = useState<number | null>(ramMin ?? (ramValues[0] ?? null))
  const [localRamMax, setLocalRamMax] = useState<number | null>(ramMax ?? (ramValues[ramValues.length - 1] ?? null))

  // facet search queries
  const [brandQuery, setBrandQuery] = useState("")
  const [cpuQuery, setCpuQuery] = useState("")
  const [gpuQuery, setGpuQuery] = useState("")

  // sync props -> local
  useEffect(() => setLocalTypes(new Set(selectedTypes)), [selectedTypes])
  useEffect(() => setLocalBrands(new Set(selectedBrands)), [selectedBrands])
  useEffect(() => setLocalCPUs(new Set(selectedCPUs)), [selectedCPUs])
  useEffect(() => setLocalGPUs(new Set(selectedGPUs)), [selectedGPUs])
  useEffect(() => {
    setLocalMinPrice(minPrice ?? priceRange.min)
    setLocalMaxPrice(maxPrice ?? priceRange.max)
  }, [minPrice, maxPrice, priceRange])
  useEffect(() => {
    setLocalRamMin(ramMin ?? (ramValues[0] ?? null))
    setLocalRamMax(ramMax ?? (ramValues[ramValues.length - 1] ?? null))
  }, [ramMin, ramMax, ramValues])

  // toggle helper
  const toggleLocalSet = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setFn((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  // apply filters
  const apply = () => {
    setSelectedTypes(new Set(localTypes))
    setSelectedBrands(new Set(localBrands))
    setSelectedCPUs(new Set(localCPUs))
    setSelectedGPUs(new Set(localGPUs))
    setMinPrice(localMinPrice)
    setMaxPrice(localMaxPrice)
    setRamMin(localRamMin)
    setRamMax(localRamMax)
    applyToUrl()
    setShowFilter(false)
  }

  const resetLocal = () => {
    resetFilters()
    setShowFilter(false)
  }

  // counts
  const counts = useMemo(() => {
    const map = {
      brand: new Map<string, number>(),
      cpu: new Map<string, number>(),
      gpu: new Map<string, number>(),
      ram: new Map<number, number>(),
    }
    for (const p of products) {
      map.brand.set(p.brand, (map.brand.get(p.brand) ?? 0) + 1)
      map.cpu.set(p.cpu, (map.cpu.get(p.cpu) ?? 0) + 1)
      map.gpu.set(p.gpu, (map.gpu.get(p.gpu) ?? 0) + 1)

      // ép kiểu RAM -> number để map
      const ramValue = typeof p.ram === "string" ? parseInt(p.ram, 10) : p.ram
      if (!isNaN(ramValue)) {
        map.ram.set(ramValue, (map.ram.get(ramValue) ?? 0) + 1)
      }
    }
    return map
  }, [products])

  // visible lists after query filter
  const visibleBrands = brandQuery
    ? brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))
    : brands
  const visibleCPUs = cpuQuery
    ? cpus.filter((c) => c.toLowerCase().includes(cpuQuery.toLowerCase()))
    : cpus
  const visibleGPUs = gpuQuery
    ? gpus.filter((g) => g.toLowerCase().includes(gpuQuery.toLowerCase()))
    : gpus

  // ensure min <= max
  useEffect(() => {
    if (localMinPrice > localMaxPrice) setLocalMaxPrice(localMinPrice)
  }, [localMinPrice])
  useEffect(() => {
    if (localMaxPrice < localMinPrice) setLocalMinPrice(localMaxPrice)
  }, [localMaxPrice])

  return (
    <aside
      className={`hidden md:block w-72 shrink-0 transition-all ${
        showFilter ? "opacity-100" : "opacity-100"
      }`}
      aria-label="Bộ lọc sản phẩm"
    >
      <div className="border rounded-lg p-4 bg-white shadow-sm sticky top-24">
        <h4 className="font-semibold mb-3">Bộ lọc</h4>

        {/* Types */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Loại</div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                aria-pressed={localTypes.has(t)}
                onClick={() => toggleLocalSet(setLocalTypes, t)}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                  localTypes.has(t)
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

        {/* Brands */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Hãng</div>
            <div className="text-xs text-gray-400">
              {products.length} sản phẩm
            </div>
          </div>
          <input
            aria-label="Tìm hãng"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Tìm hãng..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-36 overflow-auto gap-1">
            {visibleBrands.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localBrands.has(b)}
                  onChange={() => toggleLocalSet(setLocalBrands, b)}
                />
                <span className="truncate" title={b}>
                  {b}
                </span>
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
            aria-label="Tìm CPU"
            value={cpuQuery}
            onChange={(e) => setCpuQuery(e.target.value)}
            placeholder="Tìm CPU..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-40 overflow-auto gap-1">
            {visibleCPUs.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localCPUs.has(c)}
                  onChange={() => toggleLocalSet(setLocalCPUs, c)}
                />
                <span className="truncate" title={c}>
                  {c}
                </span>
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
            aria-label="Tìm GPU"
            value={gpuQuery}
            onChange={(e) => setGpuQuery(e.target.value)}
            placeholder="Tìm GPU..."
            className="w-full mb-2 border rounded px-2 py-1 text-sm"
          />
          <div className="flex flex-col max-h-40 overflow-auto gap-1">
            {visibleGPUs.map((g) => (
              <label
                key={g}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localGPUs.has(g)}
                  onChange={() => toggleLocalSet(setLocalGPUs, g)}
                />
                <span className="truncate" title={g}>
                  {g}
                </span>
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
              value={localRamMin ?? ""}
              onChange={(e) =>
                setLocalRamMin(e.target.value ? Number(e.target.value) : null)
              }
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
              value={localRamMax ?? ""}
              onChange={(e) =>
                setLocalRamMax(e.target.value ? Number(e.target.value) : null)
              }
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

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Giá</div>
            <div className="text-xs text-gray-400">
              {fmt(localMinPrice)} - {fmt(localMaxPrice)}
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <input
              aria-label="Giá tối thiểu"
              type="number"
              value={localMinPrice}
              onChange={(e) =>
                setLocalMinPrice(Number(e.target.value) || priceRange.min)
              }
              className="w-1/2 border rounded px-2 py-1"
            />
            <input
              aria-label="Giá tối đa"
              type="number"
              value={localMaxPrice}
              onChange={(e) =>
                setLocalMaxPrice(Number(e.target.value) || priceRange.max)
              }
              className="w-1/2 border rounded px-2 py-1"
            />
          </div>

          <div className="flex gap-2 items-center">
            <input
              aria-hidden
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={Math.max(
                100000,
                Math.round((priceRange.max - priceRange.min) / 100)
              )}
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={resetLocal}
            className="flex-1 px-3 py-2 border rounded bg-white"
          >
            Reset
          </button>
          <button
            onClick={apply}
            className="flex-1 px-3 py-2 rounded bg-[#9b4de0] text-white"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </aside>
  )
}
