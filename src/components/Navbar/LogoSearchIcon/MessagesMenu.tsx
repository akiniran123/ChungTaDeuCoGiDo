'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, CheckCheck, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function MessagesMenu() {
  interface MessagePreview {
    id: string
    sellerName: string
    lastMessage: string
    time: string
    unread: number
    avatar?: string
  }

  const [messageList, setMessageList] = useState<MessagePreview[]>([])
  const [openMessages, setOpenMessages] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const messagesRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMessageList([
      { id: 'c1', sellerName: 'Shop ABC', lastMessage: 'Chào bạn...', time: '2 phút', unread: 2 },
      { id: 'c2', sellerName: 'LaptopPro', lastMessage: 'Đã gửi báo giá...', time: '1 giờ', unread: 0 },
      { id: 'c3', sellerName: 'Điện Máy XYZ', lastMessage: 'Bạn ơi, hàng về rồi nhé!', time: 'Hôm qua', unread: 1 },
    ])
  }, [])

  useEffect(() => {
    setUnreadMessages(messageList.filter((m) => m.unread > 0).length)
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

  const markAllRead = () => {
    setMessageList((prev) => prev.map((m) => ({ ...m, unread: 0 })))
  }

  const clearAll = () => {
    setMessageList([])
  }

  return (
    <div className="relative" ref={messagesRef}>
      {/* Nút icon tin nhắn */}
      <button
        type="button"
        className="relative cursor-pointer focus:outline-none"
        onClick={() => setOpenMessages((v) => !v)}
        aria-label="Tin nhắn"
        aria-haspopup="true"
        aria-expanded={openMessages}
      >
        <MessageSquare className="w-6 h-6 text-gray-600 hover:text-[#9b4de0] transition-colors" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unreadMessages}
          </span>
        )}
      </button>

      {/* Menu tin nhắn */}
      <AnimatePresence>
        {openMessages && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-xl z-50"
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-sm font-semibold">Tin nhắn</span>
              <div className="flex items-center gap-3">
                {messageList.length > 0 && (
                  <>
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#9b4de0] cursor-pointer"
                    >
                      <CheckCheck size={14} />
                      Đã đọc hết
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Xóa hết
                    </button>
                  </>
                )}
                <button
                  className="text-xs text-[#9b4de0] hover:underline cursor-pointer focus:outline-none"
                  onClick={() => router.push('/messages')}
                >
                  Xem tất cả
                </button>
              </div>
            </div>

            {/* Danh sách tin nhắn */}
            <ul className="max-h-80 overflow-auto divide-y">
              {messageList.length === 0 ? (
                <li className="p-4 text-sm text-gray-500">Chưa có tin nhắn.</li>
              ) : (
                messageList.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => router.push(`/messages/${m.id}`)}
                      className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 cursor-pointer focus:outline-none transition-colors ${
                        m.unread > 0 ? 'bg-purple-50' : ''
                      }`}
                    >
                      {/* Avatar */}
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.sellerName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                          {m.sellerName.charAt(0)}
                        </div>
                      )}

                      {/* Nội dung */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm truncate ${
                              m.unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'
                            }`}
                          >
                            {m.sellerName}
                          </span>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">{m.time}</span>
                        </div>
                        <p
                          className={`text-xs truncate ${
                            m.unread > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {m.lastMessage}
                        </p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}