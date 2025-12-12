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
  const [userData, setUserData] = useState<{ username: string; avatar_url?: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  const router = useRouter()

  // Lấy user supabase
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        // Lấy thông tin từ bảng users
        const { data: profile } = await supabase
          .from('users')
          .select('username, avatar_url')
          .eq('id', data.user.id)
          .single()

        // ✅ Sửa lỗi TypeScript: ép username không null, avatar_url optional
        if (profile) {
          setUserData({
            username: profile.username || 'Người dùng',
            avatar_url: profile.avatar_url || undefined,
          })
        }
      }

      setLoadingUser(false)
    }
    getUser()
  }, [])

  // Loading icon
  if (loadingUser) {
    return <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
  }

  // --- USER CHƯA LOGIN → Hiện nút đăng nhập (không có avatar) ---
  if (!user) {
    return (
      <>
        <div
          className="flex items-center cursor-pointer px-3 py-1 rounded-md hover:bg-gray-50"
          onClick={() => setShowLogin(true)}
        >
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
  const avatar = userData?.avatar_url
  const username = userData?.username || ''

  return (
    <>
      <HeadlessMenu as="div" className="relative">
        {/* Nút hiển thị avatar + tên */}
        <HeadlessMenu.Button className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded-md">
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-white bg-gray-300 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                />
              </svg>
            </div>
          )}
          <span className="font-semibold text-sm text-gray-800">{username}</span>
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
                  setUserData(null)
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
