'use client'

import { useEffect, useState } from 'react'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

import LoginModal from "@/components/auth/components/LoginModal"

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<{ username: string; avatar_url?: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('username, avatar_url')
          .eq('id', data.user.id)
          .single()

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

  if (loadingUser) {
    return <Loader2 className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
  }

  if (!user) {
    return (
      <>
        <div className="w-full flex justify-center">
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#9b4de0] hover:bg-gray-50 transition cursor-pointer"
          >
            Đăng nhập
          </button>
        </div>

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

  const avatar = userData?.avatar_url
  const username = userData?.username || ''

  return (
    <>
      <div className="w-full flex justify-center">
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}

            <span className="font-semibold text-sm text-gray-800">
              {username}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </HeadlessMenu.Button>

          <HeadlessMenu.Items className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  /* 🚀 CẬP NHẬT Ở ĐÂY: Sử dụng template literal để truyền user.id */
                  onClick={() => router.push(`/profile/${user.id}`)}
                  className={`block w-full px-4 py-2 text-left cursor-pointer ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  Trang cá nhân
                </button>
              )}
            </HeadlessMenu.Item>

            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setUser(null)
                    setUserData(null)
                    router.push('/')
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
      </div>

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