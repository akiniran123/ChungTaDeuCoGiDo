'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type SearchResult = {
  id: string
  title: string
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        void performSearch(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // gọi API Supabase
  const performSearch = async (query: string) => {
    try {
      setLoading(true)
      setError(null)

      // 🔥 Sửa duy nhất chỗ này: đổi 'listings' -> 'products'
      const { data, error } = await supabase
        .from('products')
        .select('id, title')
        .ilike('title', `%${query}%`)
        .limit(5)

      if (error) throw error
      setSearchResults(data || [])
    } catch (err: any) {
      setError('Không thể tìm kiếm. Vui lòng thử lại.')
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // submit form -> chuyển sang trang search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
    setSearchResults([])
  }

  return (
    <div className="hidden sm:block flex-1 max-w-md relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#9b4de0] focus:ring-2 focus:ring-[#9b4de0] transition"
        />
      </form>

      {/* Dropdown kết quả */}
      {(searchResults.length > 0 || loading || error) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {loading && (
            <div className="p-2 text-sm text-gray-500">Đang tìm kiếm...</div>
          )}
          {error && (
            <div className="p-2 text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && searchResults.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setSearchResults([])}
            >
              {item.title}
            </Link>
          ))}
          {!loading && !error && searchResults.length === 0 && searchTerm.trim() && (
            <div className="p-2 text-sm text-gray-500">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  )
}
