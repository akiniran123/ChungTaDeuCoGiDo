"use client"

import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NewsItem {
  id: string
  title: string
  time: string
  href?: string
  read?: boolean
}

export default function NewsMenu() {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [openNews, setOpenNews] = useState(false)
  const [unreadNews, setUnreadNews] = useState(0)
  const newsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Demo data – thay bằng API thực tế của bạn
    setNewsList([
      { id: 'n1', title: 'Flash sale laptop cuối tuần', time: '5 phút', href: '/tin-tuc/n1', read: false },
      { id: 'n2', title: 'Ra mắt RTX 5090', time: '1 giờ', href: '/tin-tuc/n2', read: false },
      { id: 'n3', title: 'Cập nhật chính sách đổi trả', time: 'Hôm qua', href: '/tin-tuc/n3', read: true },
    ])
  }, [])

  useEffect(() => {
    const unread = newsList.filter((n) => !n.read).length
    setUnreadNews(unread > 0 ? Math.min(unread, 9) : 0)
  }, [newsList])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (newsRef.current && !newsRef.current.contains(e.target as Node)) {
        setOpenNews(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => {
    setNewsList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNewsList([])
  }

  return (
    <div className="relative" ref={newsRef}>
      <button
        type="button"
        onClick={() => setOpenNews((v) => !v)}
        aria-label="Tin tức"
        aria-expanded={openNews}
        className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b4de0] p-1 rounded"
      >
        <Bell className="w-5 h-5 text-gray-600 hover:text-[#9b4de0]" />
        {unreadNews > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {unreadNews}
          </span>
        )}
      </button>

      {openNews && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50" role="dialog" aria-label="Thông báo">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Thông báo
              <span className="text-xs text-gray-500 font-normal">({newsList.length})</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                disabled={newsList.length === 0}
                className="text-xs text-gray-500 hover:text-green-600 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" /> Đã đọc hết
              </button>
              <button
                onClick={clearAll}
                disabled={newsList.length === 0}
                className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Xóa hết
              </button>
            </div>
          </div>

          <ul className="max-h-80 overflow-auto divide-y" role="list">
            {newsList.length === 0 ? (
              <li className="p-6 text-sm text-gray-500 text-center">Chưa có thông báo nào.</li>
            ) : (
              newsList.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => {
                      setNewsList((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)))
                      router.push(n.href || `/tin-tuc/${n.id}`)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-[#f9f5ff]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${!n.read ? 'text-[#9b4de0]' : ''}`}>{n.title}</p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          {newsList.length > 0 && (
            <div className="px-4 py-3 border-t text-right">
              <button
                onClick={() => router.push('/tin-tuc')}
                className="text-sm text-[#9b4de0] hover:underline cursor-pointer"
              >
                Xem tất cả tin tức
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}