'use client'

import { useEffect, useState } from 'react'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { ChevronDown, Loader2, User as UserIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function UserMenu({ onLoginClick }: { onLoginClick: () => void }) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoadingUser(false)
    }
    getUser()
  }, [])

  if (loadingUser) {
    return <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
  }

  if (!user) {
    return (
      <UserIcon
        className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer"
        onClick={onLoginClick}
      />
    )
  }

  return (
    <HeadlessMenu as="div" className="relative">
      <HeadlessMenu.Button className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#9b4de0] cursor-pointer">
        <UserIcon className="w-5 h-5 cursor-pointer" />
        <ChevronDown className="w-4 h-4" />
      </HeadlessMenu.Button>

      <HeadlessMenu.Items
        className="absolute right-2 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm"
      >

        {/* Trang cá nhân */}
        <HeadlessMenu.Item>
          {({ active }) => (
            <button
              onClick={() => router.push('/profile')}
              className={`block w-full px-4 py-2 text-left cursor-pointer ${
                active ? 'bg-gray-100' : ''
              }`}
            >
              Trang cá nhân
            </button>
          )}
        </HeadlessMenu.Item>

        {/* Đăng xuất */}
        <HeadlessMenu.Item>
          {({ active }) => (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                setUser(null)
                router.refresh()
              }}
              className={`block w-full px-4 py-2 text-left text-red-500 cursor-pointer ${
                active ? 'bg-gray-100' : ''
              }`}
            >
              Đăng xuất
            </button>
          )}
        </HeadlessMenu.Item>

      </HeadlessMenu.Items>
    </HeadlessMenu>
  )
}

