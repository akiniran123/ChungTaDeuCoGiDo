'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Bell,
  ShoppingCart,
  User as UserIcon,
  Menu,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

import ThemeToggle from './ThemeToggle'
import LoginModal from '@/components/auth/LoginModal'

interface Props {
  onMenuToggle?: () => void
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [pendingRedirect, setPendingRedirect] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoadingUser(false)
    }
    getUser()
  }, [])

  const handleStartSelling = () => {
    if (user) {
      router.push('/sell')
    } else {
      setPendingRedirect(true)
      setShowLogin(true)
    }
  }

  const handleIconClick = () => {
    if (!user) setShowLogin(true)
  }

  return (
    <>
      <div className="w-full border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden text-gray-700 dark:text-gray-300"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
              <span className="text-[#9b4de0]">🛡</span>
              <span className="text-black dark:text-white">jawa</span>
            </Link>
          </div>

          {/* Middle: Search (Desktop only) */}
          <div className="hidden sm:block flex-1 max-w-xl mx-4">
            <input
              type="text"
              placeholder="Search listings and sellers"
              className="w-full px-5 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
            />
          </div>

          {/* Right: Icons & Actions */}
          <div className="flex items-center gap-3">
            {loadingUser ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <>
                <button
                  onClick={handleStartSelling}
                  className="hidden sm:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-sm rounded-full font-semibold transition cursor-pointer"
                  aria-label="Start Selling"
                >
                  START SELLING
                </button>

                <Heart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
                <Bell className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
                <ShoppingCart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />

                {user ? (
                  <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center gap-1 text-sm focus:outline-none hover:text-indigo-500">
                      <UserIcon className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </HeadlessMenu.Button>

                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 text-sm">
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => router.push('/profile')}
                            className={`block w-full text-left px-4 py-2 ${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            }`}
                          >
                            Profile
                          </button>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={async () => {
                              await supabase.auth.signOut()
                              setUser(null)
                              router.refresh()
                            }}
                            className={`block w-full text-left px-4 py-2 text-red-500 ${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            }`}
                          >
                            Sign out
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </HeadlessMenu.Items>
                  </HeadlessMenu>
                ) : (
                  <UserIcon className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
                )}
              </>
            )}

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Search listings and sellers"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
          />
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          redirectTo={pendingRedirect ? '/sell' : undefined}
          onClose={() => {
            setShowLogin(false)
            setPendingRedirect(false)
          }}
          onLoginSuccess={async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
          }}
        />
      )}
    </>
  )
}
