'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type MessageItem = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string | null
  is_read: boolean | null
  sender?: {
    username?: string | null
    avatar_url?: string | null
  } | null
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!userId) return
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

      const uniqueMessages = Object.values(
        (data as MessageItem[]).reduce((acc, msg) => {
          if (!acc[msg.sender_id]) acc[msg.sender_id] = msg
          return acc
        }, {} as Record<string, MessageItem>)
      )

      setMessages(uniqueMessages)
      setLoading(false)
    }

    fetchMessages()
  }, [userId])

  if (loading) return <div className="p-4">Đang tải...</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">Tất cả tin nhắn</h1>
      {messages.length === 0 ? (
        <div className="text-gray-500 text-sm">Chưa có tin nhắn nào</div>
      ) : (
        <ul className="divide-y">
          {messages.map((msg) => (
            <li key={msg.id} className="p-2 flex items-center gap-3 hover:bg-gray-100 rounded-md">
              <img
                src={msg.sender?.avatar_url || '/default-avatar.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium">{msg.sender?.username || 'Người dùng'}</div>
                <Link href={`/messages/${msg.sender_id}`} className="block text-gray-600 truncate">
                  {msg.content}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
