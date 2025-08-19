'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewsMenu() {
  const [newsList, setNewsList] = useState<
    {
      id: string
      title: string
      time: string
      href?: string
    }[]
  >([])
  const [openNews, setOpenNews] = useState(false)
  const [unreadNews, setUnreadNews] = useState(0)
  const newsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Demo data – thay bằng API thực tế của bạn
    setNewsList([
      { id: 'n1', title: 'Flash sale laptop cuối tuần', time: '5 phút', href: '/tin-tuc/n1' },
      { id: 'n2', title: 'Ra mắt RTX 5090', time: '1 giờ', href: '/tin-tuc/n2' },
      { id: 'n3', title: 'Cập nhật chính sách đổi trả', time: 'Hôm qua', href: '/tin-tuc/n3' },
    ])
  }, [])

  useEffect(() => {
    setUnreadNews(newsList.length > 0 ? Math.min(newsList.length, 9) : 0)
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

  return (
    <div className="relative" ref={newsRef}>
      <button
        type="button"
        className="relative"
        onClick={() => setOpenNews(v => !v)}
        aria-label="Tin tức"
      >
        <Bell className="w-5 h-5 text-gray-600 hover:text-[#9b4de0]" />
        {unreadNews > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {unreadNews}
          </span>
        )}
      </button>

      {openNews && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="text-sm font-semibold">Tin tức</span>
            <button
              className="text-xs text-[#9b4de0] hover:underline"
              onClick={() => router.push('/tin-tuc')}
            >
              Xem tất cả
            </button>
          </div>
          <ul className="max-h-80 overflow-auto">
            {newsList.length === 0 ? (
              <li className="p-4 text-sm text-gray-500">Chưa có thông báo.</li>
            ) : (
              newsList.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => router.push(n.href || `/tin-tuc/${n.id}`)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
