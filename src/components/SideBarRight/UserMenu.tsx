'use client'

import { useEffect, useState, useCallback } from 'react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { ChevronDown, Loader2, User, LogOut, UserCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'

import LoginModal from "@/components/auth/components/LoginModal"

export default function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  const router = useRouter()

  // Hàm xử lý dữ liệu hiển thị từ Authentication (Không dùng bảng DB nữa)
  const getDisplayName = (currentUser: SupabaseUser) => {
    if (currentUser.is_anonymous) return 'Khách dùng thử'
    // Lấy tên từ Google Metadata hoặc cắt từ Email
    return currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Thành viên'
  }

  const getAvatar = (currentUser: SupabaseUser) => {
    return currentUser.user_metadata?.avatar_url || null
  }

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        // Dùng getSession để lấy dữ liệu nhanh, tránh treo
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setUser(session?.user || null)
        }
      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        if (isMounted) setLoadingUser(false)
      }
    }

    initAuth()

    // Lắng nghe sự kiện Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return
      
      const currentUser = session?.user || null
      setUser(currentUser)
      setLoadingUser(false)

      if (event === 'SIGNED_IN') {
        router.refresh()
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-10 w-full">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="w-full flex justify-center">
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Đăng nhập
          </button>
        </div>

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginSuccess={() => setShowLogin(false)}
          />
        )}
      </>
    )
  }

  const username = getDisplayName(user)
  const avatar = getAvatar(user)

  return (
    <div className="w-full flex justify-center">
      <HeadlessMenu as="div" className="relative inline-block text-left">
        <HeadlessMenu.Button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer group">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
              <User size={18} />
            </div>
          )}

          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="font-bold text-sm text-gray-800 max-w-[100px] truncate">
              {username}
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              {user.is_anonymous ? 'Chế độ khách' : 'Thành viên'}
            </span>
          </div>
          
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform" />
        </HeadlessMenu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <HeadlessMenu.Items className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 origin-top bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] py-2 focus:outline-none">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tài khoản</p>
              <p className="text-xs text-gray-600 truncate font-medium">
                {user.is_anonymous ? 'Đã đăng nhập ẩn danh' : user.email}
              </p>
            </div>

            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push(`/profile/${user.id}`)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  <UserCircle size={18} />
                  Trang cá nhân
                </button>
              )}
            </HeadlessMenu.Item>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setUser(null)
                    router.push('/')
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    active ? 'bg-red-50 text-red-600' : 'text-red-500'
                  }`}
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              )}
            </HeadlessMenu.Item>
          </HeadlessMenu.Items>
        </Transition>
      </HeadlessMenu>
    </div>
  )
}