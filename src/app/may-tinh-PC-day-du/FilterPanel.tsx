"use client"

import React from "react"
import { toggleSet, fmt } from "./utils"
import { Product } from "./types"

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
  applyToUrl
}: any) {
  return (
    <aside
      className={`hidden md:block w-72 shrink-0 transition-all ${
        showFilter ? "opacity-100" : "opacity-100"
      }`}
    >
      <div className="border rounded-lg p-4 bg-white shadow-sm sticky top-24">
        <h4 className="font-semibold mb-3">Bộ lọc</h4>

        {/* Types */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Loại</div>
          <div className="flex flex-wrap gap-2">
            {["gaming", "office", "workstation", "mini"].map((t) => (
              <button
                key={t}
                onClick={() => toggleSet(selectedTypes, setSelectedTypes, t)}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
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

        {/* Brands */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Hãng</div>
          <div className="flex flex-col gap-2 max-h-36 overflow-auto">
            {brands.map((b: string) => (
              <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(b)}
                  onChange={() => toggleSet(selectedBrands, setSelectedBrands, b)}
                />
                <span className="truncate" title={b}>{b}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({products.filter((p: Product) => p.brand === b).length})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* CPU */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">CPU</div>
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {cpus.map((c: string) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCPUs.has(c)}
                  onChange={() => toggleSet(selectedCPUs, setSelectedCPUs, c)}
                />
                <span className="truncate" title={c}>{c}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({products.filter((p: Product) => p.cpu === c).length})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* GPU */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">GPU</div>
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {gpus.map((g: string) => (
              <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedGPUs.has(g)}
                  onChange={() => toggleSet(selectedGPUs, setSelectedGPUs, g)}
                />
                <span className="truncate" title={g}>{g}</span>
                <span className="ml-auto text-xs text-gray-400">
                  ({products.filter((p: Product) => p.gpu === g).length})
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
              {ramValues.map((r: number) => (
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
              {ramValues.map((r: number) => (
                <option key={r} value={r}>
                  {r}GB
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Giá</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minPrice ?? ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : priceRange.min)
              }
              className="w-full border rounded px-2 py-1"
            />
            <span>-</span>
            <input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : priceRange.max)
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Khoảng: {fmt(priceRange.min)} — {fmt(priceRange.max)}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={resetFilters}
            className="flex-1 px-3 py-2 border rounded bg-white cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => {
              setShowFilter(false)
              applyToUrl()
            }}
            className="flex-1 px-3 py-2 rounded bg-[#9b4de0] text-white cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </aside>
  )
}
