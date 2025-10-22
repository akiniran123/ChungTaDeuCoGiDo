// src/components/LogoSearchIcon/MessagesMenu.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, X } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type MessageItem = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string | null
  type: string | null
  is_read: boolean | null
}

export default function MessagesMenu() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Lấy ID user hiện tại từ Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    getUser()
  }, [])

  // Fetch tin nhắn mới nhất cho user hiện tại
  useEffect(() => {
    if (!open || !userId) return

    const fetchMessages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Lỗi fetch messages:', error)
        setLoading(false)
        return
      }

      if (data) {
        const cleanData: MessageItem[] = (data as any[]).map((msg) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.content,
          created_at: msg.created_at,
          type: msg.type ?? null,
          is_read: msg.is_read ?? null,
        }))
        setMessages(cleanData)
      }
      setLoading(false)
    }

    fetchMessages()
  }, [open, userId])

  // Số tin nhắn chưa đọc
  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="relative">
      <button
        className="p-2 hover:text-pink-600 cursor-pointer relative"
        onClick={() => setOpen(!open)}
        aria-label="Tin nhắn"
      >
        <MessageSquare size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <div className="flex justify-between items-center p-2 border-b font-semibold">
            Tin nhắn
            <button onClick={() => setOpen(false)} className="hover:text-gray-700">
              <X size={16} />
            </button>
          </div>

          {loading ? (
            <div className="p-2 text-sm text-gray-400">Đang tải...</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {messages.length === 0 && (
                <li className="p-2 text-sm text-gray-400">Chưa có tin nhắn</li>
              )}
              {messages.map((msg) => (
                <li key={msg.id} className="p-2 border-b hover:bg-gray-100 text-sm">
                  <Link href={`/messages/${msg.id}`}>{msg.content}</Link>
                </li>
              ))}
            </ul>
          )}

          <div className="text-center text-xs text-gray-500 p-2 border-t">
            <Link href="/messages">Xem tất cả</Link>
          </div>
        </div>
      )}
    </div>
  )
}
