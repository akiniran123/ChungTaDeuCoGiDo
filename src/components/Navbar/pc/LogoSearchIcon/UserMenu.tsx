'use client'

import { useEffect, useState } from 'react'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

// Import LoginModal
import LoginModal from "@/components/auth/pc/LoginModal"

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  const router = useRouter()

  // Lấy user supabase
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoadingUser(false)
    }
    getUser()
  }, [])

  // Loading icon
  if (loadingUser) {
    return <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
  }

  // --- USER CHƯA LOGIN → Hiện nút đăng nhập ---
  if (!user) {
    return (
      <>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowLogin(true)}
        >
          <img
            src="/default-avatar.png"
            alt="Guest Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-700 hover:text-[#9b4de0]">
            Đăng nhập
          </span>
        </div>

        {/* Modal đăng nhập */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginSuccess={() => {
              setShowLogin(false)
              router.refresh() // Load trạng thái user
            }}
          />
        )}
      </>
    )
  }

  // --- USER ĐÃ ĐĂNG NHẬP → Dropdown menu ---
  const avatar = user.user_metadata?.avatar_url || '/default-avatar.png'
  const username = user.user_metadata?.username || 'aki_photozz'
  const fullName = user.user_metadata?.full_name || 'Hà Song Phương'

  return (
    <>
      <HeadlessMenu as="div" className="relative">
        {/* Nút hiển thị avatar + tên */}
        <HeadlessMenu.Button className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded-md">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm text-gray-800">{username}</span>
            <span className="text-xs text-gray-500">{fullName}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </HeadlessMenu.Button>

        {/* Dropdown */}
        <HeadlessMenu.Items
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm"
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

      {/* Modal login nếu cần (fail-safe) */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
