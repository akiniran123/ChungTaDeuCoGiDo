'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MessagePreview {
  id: string
  sellerName: string
  lastMessage: string
  time: string
  unread: number
}

export default function MessagesMenu() {
  const [messageList, setMessageList] = useState<MessagePreview[]>([])
  const [openMessages, setOpenMessages] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const messagesRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMessageList([
      { id: 'c1', sellerName: 'Shop ABC', lastMessage: 'Chào bạn...', time: '2 phút', unread: 2 },
      { id: 'c2', sellerName: 'LaptopPro', lastMessage: 'Đã gửi báo giá...', time: '1 giờ', unread: 0 }
    ])
  }, [])

  useEffect(() => {
    setUnreadMessages(messageList.filter(m => m.unread > 0).length)
  }, [messageList])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) {
        setOpenMessages(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={messagesRef}>
      <button
        type="button"
        className="relative"
        onClick={() => setOpenMessages(v => !v)}
        aria-label="Tin nhắn"
      >
        <MessageSquare className="w-5 h-5 text-gray-600 hover:text-[#9b4de0]" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {unreadMessages}
          </span>
        )}
      </button>

      {openMessages && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="text-sm font-semibold">Tin nhắn</span>
            <button
              className="text-xs text-[#9b4de0] hover:underline"
              onClick={() => router.push('/messages')}
            >
              Xem tất cả
            </button>
          </div>
          <ul className="max-h-80 overflow-auto">
            {messageList.length === 0 ? (
              <li className="p-4 text-sm text-gray-500">Chưa có tin nhắn.</li>
            ) : (
              messageList.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => router.push(`/messages/${m.id}`)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {m.sellerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{m.sellerName}</span>
                        <span className="text-[11px] text-gray-400">{m.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{m.lastMessage}</p>
                      {m.unread > 0 && (
                        <span className="mt-1 inline-block text-[10px] bg-red-500 text-white rounded-full px-2 py-0.5">
                          Mới
                        </span>
                      )}
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