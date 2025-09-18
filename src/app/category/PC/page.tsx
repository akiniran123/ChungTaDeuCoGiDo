"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type Product = {
  id: number
  type: 'gaming' | 'office' | 'workstation' | 'mini'
  brand: string
  cpu: string
  gpu: string
  ram: string
  name: string
  price: number // VND as number
  description: string
  images: string[]
  stock?: number
}

export default function PCPage() {
  const router = useRouter()
  const pathname = usePathname()

  // ---------- DATA (for demo). In production you should load from API ----------
  const products: Product[] = [
    { id: 1, type: 'gaming', brand: 'ASUS', cpu: 'Intel Core i7', gpu: 'RTX 4070', ram: '16GB', name: 'PC Gaming ASUS RTX 4070', price: 35000000, description: 'Hiệu năng cao, chơi game mượt mà', images: ['https://images.unsplash.com/photo-1612831455542-2d3e2b9c8b91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455645-4b9f9c9e5d32?auto=format&fit=crop&w=800&q=80'], stock: 5 },
    { id: 2, type: 'office', brand: 'HP', cpu: 'Intel Core i5', gpu: 'Intel UHD', ram: '8GB', name: 'PC Văn phòng HP Core i5', price: 12000000, description: 'Tiết kiệm điện, chạy ổn định', images: ['https://images.unsplash.com/photo-1587202372775-9899f1f9c3f4?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1587202372790-7b2d9c8f7e2b?auto=format&fit=crop&w=800&q=80'], stock: 12 },
    { id: 3, type: 'workstation', brand: 'Dell', cpu: 'AMD Ryzen 9', gpu: 'RTX 3080', ram: '32GB', name: 'Workstation Dell RTX 3080', price: 45000000, description: 'Phục vụ dựng phim, thiết kế 3D chuyên nghiệp', images: ['https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603791440390-7a1f8f7e8e2b?auto=format&fit=crop&w=800&q=80'], stock: 3 },
    { id: 4, type: 'gaming', brand: 'MSI', cpu: 'AMD Ryzen 7', gpu: 'RX 6800 XT', ram: '16GB', name: 'PC Gaming MSI Ryzen 7', price: 30000000, description: 'Chiến game AAA cực mượt', images: ['https://images.unsplash.com/photo-1612831455702-5b2e9c8f7b91?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455720-9b3e8c9f5d32?auto=format&fit=crop&w=800&q=80'], stock: 7 },
    { id: 5, type: 'office', brand: 'Lenovo', cpu: 'Intel Core i3', gpu: 'Intel UHD', ram: '8GB', name: 'Lenovo ThinkCentre Core i3', price: 9500000, description: 'PC văn phòng gọn nhẹ, bền bỉ', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517336714732-4a2e9c8f7b91?auto=format&fit=crop&w=800&q=80'], stock: 25 },
    { id: 6, type: 'mini', brand: 'Intel', cpu: 'Intel Core i5', gpu: 'Intel Iris Xe', ram: '16GB', name: 'Intel NUC Mini PC', price: 15000000, description: 'Mini PC nhỏ gọn, tiết kiệm không gian', images: ['https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1593642634368-5b2e9c8f7b91?auto=format&fit=crop&w=800&q=80'], stock: 10 },
    { id: 7, type: 'gaming', brand: 'Gigabyte', cpu: 'Intel Core i9', gpu: 'RTX 4090', ram: '64GB', name: 'PC Gaming Gigabyte RTX 4090', price: 75000000, description: 'Máy quái vật dành cho game 4K, VR và livestream', images: ['https://images.unsplash.com/photo-1612831455750-7b2e9c8f5d32?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455765-4b3e8c9f5d33?auto=format&fit=crop&w=800&q=80'], stock: 2 },
    { id: 8, type: 'workstation', brand: 'Apple', cpu: 'Apple M2 Ultra', gpu: 'Integrated GPU 60-core', ram: '128GB', name: 'Mac Studio Workstation', price: 120000000, description: 'Cỗ máy mạnh mẽ cho nhà sáng tạo nội dung chuyên nghiệp', images: ['https://images.unsplash.com/photo-1655720305387-3a59e9f1e43f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1655720305547-5c40d9e4e7f6?auto=format&fit=crop&w=800&q=80'], stock: 1 },
    { id: 9, type: 'gaming', brand: 'Acer', cpu: 'AMD Ryzen 5', gpu: 'RTX 3060', ram: '16GB', name: 'Acer Nitro Gaming PC', price: 25000000, description: 'Giải pháp gaming phổ thông mạnh mẽ', images: ['https://images.unsplash.com/photo-1612831455772-5b3e8c9f5d34?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455789-7b3e8c9f5d35?auto=format&fit=crop&w=800&q=80'], stock: 8 },
    { id: 10, type: 'office', brand: 'Dell', cpu: 'Intel Core i7', gpu: 'Intel UHD', ram: '16GB', name: 'Dell OptiPlex i7', price: 18000000, description: 'Dòng máy văn phòng cao cấp, bền bỉ', images: ['https://images.unsplash.com/photo-1612831455799-5b3e8c9f5d36?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455805-7b3e8c9f5d37?auto=format&fit=crop&w=800&q=80'], stock: 15 },
    { id: 11, type: 'mini', brand: 'Apple', cpu: 'Apple M1', gpu: 'Integrated GPU 8-core', ram: '16GB', name: 'Mac Mini M1', price: 20000000, description: 'Mini PC mạnh mẽ, tối ưu hệ sinh thái Apple', images: ['https://images.unsplash.com/photo-1612831455815-5b3e8c9f5d38?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455820-7b3e8c9f5d39?auto=format&fit=crop&w=800&q=80'], stock: 6 },
    { id: 12, type: 'workstation', brand: 'HP', cpu: 'Intel Xeon', gpu: 'Quadro RTX 5000', ram: '64GB', name: 'HP Z Workstation', price: 95000000, description: 'Máy trạm cho kỹ sư và thiết kế 3D', images: ['https://images.unsplash.com/photo-1612831455830-5b3e8c9f5d40?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1612831455835-7b3e8c9f5d41?auto=format&fit=crop&w=800&q=80'], stock: 2 },
  ]

  // ---------- FILTER STATE ----------
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [selectedCPUs, setSelectedCPUs] = useState<Set<string>>(new Set())
  const [selectedGPUs, setSelectedGPUs] = useState<Set<string>>(new Set())
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [ramMin, setRamMin] = useState<number | null>(null)
  const [ramMax, setRamMax] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name-asc'>('relevance')
  const [page, setPage] = useState(1)
  const perPage = 9

  // Derived facets
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products])
  const types = useMemo(() => Array.from(new Set(products.map((p) => p.type))).sort(), [products])
  const cpus = useMemo(() => Array.from(new Set(products.map((p) => p.cpu))).sort(), [products])
  const gpus = useMemo(() => Array.from(new Set(products.map((p) => p.gpu))).sort(), [products])
  const ramValues = useMemo(() => Array.from(new Set(products.map((p) => parseInt(p.ram)))).sort((a, b) => a - b), [products])

  const priceRange = useMemo(() => {
    const values = products.map((p) => p.price)
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [products])

  // Initialize price/ram filters on mount to full range
  useEffect(() => {
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setRamMin(ramValues[0] ?? null)
    setRamMax(ramValues[ramValues.length - 1] ?? null)
  }, [priceRange, ramValues])

  // ---------- HELPERS ----------
  const toggleSet = (s: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    const next = new Set(s)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setFn(next)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedTypes(new Set())
    setSelectedBrands(new Set())
    setSelectedCPUs(new Set())
    setSelectedGPUs(new Set())
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setRamMin(ramValues[0] ?? null)
    setRamMax(ramValues[ramValues.length - 1] ?? null)
    setSortBy('relevance')
    setPage(1)
  }

  // Format currency
  const fmt = (v: number) => v.toLocaleString('vi-VN') + '₫'

  // ---------- FILTERED & SORTED ----------
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
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
        // relevance: keep original order (or you can implement a smarter score)
        return a.id - b.id
      })
  }, [products, search, selectedTypes, selectedBrands, selectedCPUs, selectedGPUs, minPrice, maxPrice, ramMin, ramMax, sortBy])

  // Pagination
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const paginated = useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page])

  // Filter chips for quick removal
  const chips = useMemo(() => {
    const c: { key: string; label: string; onRemove: () => void }[] = []
    if (search) c.push({ key: 'q', label: `"${search}"`, onRemove: () => setSearch('') })
    selectedTypes.forEach((t) => c.push({ key: `type:${t}`, label: t, onRemove: () => toggleSet(selectedTypes, setSelectedTypes, t) }))
    selectedBrands.forEach((b) => c.push({ key: `brand:${b}`, label: b, onRemove: () => toggleSet(selectedBrands, setSelectedBrands, b) }))
    selectedCPUs.forEach((cname) => c.push({ key: `cpu:${cname}`, label: cname, onRemove: () => toggleSet(selectedCPUs, setSelectedCPUs, cname) }))
    selectedGPUs.forEach((g) => c.push({ key: `gpu:${g}`, label: g, onRemove: () => toggleSet(selectedGPUs, setSelectedGPUs, g) }))
    if (minPrice !== null && minPrice > priceRange.min) c.push({ key: 'minPrice', label: `≥ ${fmt(minPrice)}`, onRemove: () => setMinPrice(priceRange.min) })
    if (maxPrice !== null && maxPrice < priceRange.max) c.push({ key: 'maxPrice', label: `≤ ${fmt(maxPrice)}`, onRemove: () => setMaxPrice(priceRange.max) })
    if (ramMin !== null && ramMin > (ramValues[0] ?? 0)) c.push({ key: 'ramMin', label: `RAM ≥ ${ramMin}GB`, onRemove: () => setRamMin(ramValues[0] ?? null) })
    if (ramMax !== null && ramMax < (ramValues[ramValues.length - 1] ?? 0)) c.push({ key: 'ramMax', label: `RAM ≤ ${ramMax}GB`, onRemove: () => setRamMax(ramValues[ramValues.length - 1] ?? null) })
    return c
  }, [search, selectedTypes, selectedBrands, selectedCPUs, selectedGPUs, minPrice, maxPrice, ramMin, ramMax, priceRange, ramValues])

  // Debounce search input for UX
  const searchRef = useRef<number | null>(null)
  const onSearchChange = (v: string) => {
    if (searchRef.current) window.clearTimeout(searchRef.current)
    // live filter after 300ms
    searchRef.current = window.setTimeout(() => {
      setSearch(v)
      setPage(1)
    }, 300)
  }

  // Apply filters to URL (optional; useful for shareable links)
  const applyToUrl = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedBrands.size) params.set('brands', Array.from(selectedBrands).join(','))
    if (selectedTypes.size) params.set('types', Array.from(selectedTypes).join(','))
    if (selectedCPUs.size) params.set('cpus', Array.from(selectedCPUs).join(','))
    if (selectedGPUs.size) params.set('gpus', Array.from(selectedGPUs).join(','))
    if (minPrice !== null) params.set('minPrice', String(minPrice))
    if (maxPrice !== null) params.set('maxPrice', String(maxPrice))
    if (ramMin !== null) params.set('ramMin', String(ramMin))
    if (ramMax !== null) params.set('ramMax', String(ramMax))
    if (sortBy) params.set('sort', sortBy)
    if (page) params.set('page', String(page))
    const url = `${pathname}?${params.toString()}`
    router.replace(url)
  }

  // ---------- RENDER ----------
  return (
    <div className="pt-20 p-4 max-w-screen-5xl mx-auto">
      <div className="max-w-screen-xl mx-auto">
        {/* Search + Top controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1 flex items-center gap-3">
            <input
              type="search"
              placeholder="Tìm kiếm tên, CPU, GPU, hãng..."
              aria-label="Tìm kiếm sản phẩm"
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b4de0]"
            />

            <button onClick={() => setShowFilter((s) => !s)} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
              Bộ lọc
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm">Sắp xếp</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border rounded px-3 py-2">
              <option value="relevance">Phù hợp nhất</option>
              <option value="price-asc">Giá: thấp → cao</option>
              <option value="price-desc">Giá: cao → thấp</option>
              <option value="name-asc">Tên A → Z</option>
            </select>

            <div className="text-sm text-gray-500">{total} sản phẩm</div>

            <button onClick={applyToUrl} className="px-3 py-2 rounded bg-[#9b4de0] text-white cursor-pointer">Lưu / Chia sẻ bộ lọc</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter panel (desktop) */}
          <aside className={`hidden md:block w-72 shrink-0 transition-all ${showFilter ? 'opacity-100' : 'opacity-100'}`}>
            <div className="border rounded-lg p-4 bg-white shadow-sm sticky top-24">
              <h4 className="font-semibold mb-3">Bộ lọc</h4>

              {/* Types */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Loại</div>
                <div className="flex flex-wrap gap-2">
                  {['gaming', 'office', 'workstation', 'mini'].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleSet(selectedTypes, setSelectedTypes, t)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${selectedTypes.has(t) ? 'bg-[#9b4de0] text-white border-[#9b4de0]' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {t === 'gaming' ? 'PC Gaming' : t === 'office' ? 'Văn phòng' : t === 'workstation' ? 'Workstation' : 'Mini PC'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Hãng</div>
                <div className="flex flex-col gap-2 max-h-36 overflow-auto">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.has(b)} onChange={() => toggleSet(selectedBrands, setSelectedBrands, b)} />
                      <span className="truncate" title={b}>{b}</span>
                      <span className="ml-auto text-xs text-gray-400">({products.filter(p => p.brand === b).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CPU */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">CPU</div>
                <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                  {cpus.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedCPUs.has(c)} onChange={() => toggleSet(selectedCPUs, setSelectedCPUs, c)} />
                      <span className="truncate" title={c}>{c}</span>
                      <span className="ml-auto text-xs text-gray-400">({products.filter(p => p.cpu === c).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GPU */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">GPU</div>
                <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                  {gpus.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedGPUs.has(g)} onChange={() => toggleSet(selectedGPUs, setSelectedGPUs, g)} />
                      <span className="truncate" title={g}>{g}</span>
                      <span className="ml-auto text-xs text-gray-400">({products.filter(p => p.gpu === g).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RAM */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">RAM (GB)</div>
                <div className="flex items-center gap-2">
                  <select value={ramMin ?? ''} onChange={(e) => setRamMin(e.target.value ? Number(e.target.value) : null)} className="border rounded px-2 py-1">
                    <option value="">Min</option>
                    {ramValues.map((r) => <option key={r} value={r}>{r}GB</option>)}
                  </select>
                  <span>-</span>
                  <select value={ramMax ?? ''} onChange={(e) => setRamMax(e.target.value ? Number(e.target.value) : null)} className="border rounded px-2 py-1">
                    <option value="">Max</option>
                    {ramValues.map((r) => <option key={r} value={r}>{r}GB</option>)}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Giá</div>
                <div className="flex items-center gap-2">
                  <input type="number" value={minPrice ?? ''} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : priceRange.min)} className="w-full border rounded px-2 py-1" />
                  <span>-</span>
                  <input type="number" value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : priceRange.max)} className="w-full border rounded px-2 py-1" />
                </div>
                <div className="mt-2 text-xs text-gray-500">Khoảng: {fmt(priceRange.min)} — {fmt(priceRange.max)}</div>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={resetFilters} className="flex-1 px-3 py-2 border rounded bg-white cursor-pointer">Reset</button>
                <button onClick={() => { setShowFilter(false); applyToUrl(); }} className="flex-1 px-3 py-2 rounded bg-[#9b4de0] text-white cursor-pointer">Áp dụng</button>
              </div>
            </div>
          </aside>

          {/* Products list */}
          <main className="flex-1">
            {/* Filter chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span key={c.key} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>{c.label}</span>
                  <button onClick={c.onRemove} aria-label={`Remove ${c.label}`} className="text-xs font-bold ml-1 cursor-pointer">×</button>
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((p) => (
                <article key={p.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white">
                  <img src={p.images[0]} alt={p.name} className="w-full h-44 object-cover" loading="lazy" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{p.name}</h3>
                    <p className="text-sm text-gray-600 truncate mt-1">{p.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <div><strong>Hãng:</strong> {p.brand}</div>
                      <div><strong>CPU:</strong> {p.cpu}</div>
                      <div><strong>GPU:</strong> {p.gpu}</div>
                      <div><strong>RAM:</strong> {p.ram}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xl font-bold text-blue-600">{fmt(p.price)}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/products/${p.id}`)} className="px-3 py-2 border rounded text-sm cursor-pointer">Xem</button>
                        <button onClick={() => alert('Add to cart demo')} className="px-3 py-2 bg-green-600 text-white rounded text-sm cursor-pointer">Mua</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">Hiển thị {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} trên {total} sản phẩm</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50">Trước</button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-[#9b4de0] text-white' : 'bg-white border'}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50">Tiếp</button>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setShowFilter(false)} />
      )}
    </div>
  )
}
