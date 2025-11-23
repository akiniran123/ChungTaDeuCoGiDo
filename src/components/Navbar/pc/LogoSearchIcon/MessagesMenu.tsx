'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type MessageItem = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string | null
  type?: string | null
  is_read: boolean | null
  sender?: {
    username?: string | null
    avatar_url?: string | null
  } | null
}

export default function MessagesMenu() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!open || !userId) return

    const fetchMessages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          is_read,
          sender:sender_id(username, avatar_url)
        `)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Lỗi fetch messages:', error)
        setLoading(false)
        return
      }

      const formatted = (data as any[]).map((msg) => ({
        ...msg,
        type: msg.type ?? 'text',
      })) as MessageItem[]

      const uniqueMessages = Object.values(
        formatted.reduce((acc, msg) => {
          if (!acc[msg.sender_id]) acc[msg.sender_id] = msg
          return acc
        }, {} as Record<string, MessageItem>)
      )

      setMessages(uniqueMessages)
      setLoading(false)
    }

    fetchMessages()
  }, [open, userId])

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="relative">
      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <div className="flex justify-between items-center p-2 border-b font-semibold bg-white sticky top-0 z-10">
            Tin nhắn
            <button onClick={() => setOpen(false)} className="hover:text-gray-700">
              <X size={16} />
            </button>
          </div>

          {loading ? (
            <div className="p-3 text-sm text-gray-500">Đang tải...</div>
          ) : (
            <>
              <ul className="max-h-60 overflow-y-auto">
                {messages.length === 0 && (
                  <li className="p-3 text-sm text-gray-400">Chưa có tin nhắn</li>
                )}

                {messages.map((msg) => (
                  <li key={msg.id} className="border-b">
                    <Link
                      href={`/messages/${msg.sender_id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <img
                        src={msg.sender?.avatar_url || '/default-avatar.png'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />

                      <div className="flex-1">
                        <div className="font-medium">{msg.sender?.username || 'Người dùng'}</div>
                        <div className="text-gray-500 truncate">{msg.content}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="text-center text-xs text-gray-500 p-2 border-t">
                {messages.length > 0 ? 'Đã hết tin nhắn' : 'Chưa có tin nhắn'}
              </div>
            </>
          )}
        </div>
      )}

      {/* EXPOSE API CHO SIDEBAR */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open messages"
        className="hidden"
        id="messagesMenuTrigger"
      ></button>

      {/* unread gắn để Sidebar đọc */}
      <span id="messagesUnreadCount" className="hidden">
        {unreadCount}
      </span>
    </div>
  )
}
