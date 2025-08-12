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
import LoginModal from '@/components/auth/LoginModal'

interface Props {
  onMenuToggle?: () => void
}

interface Listing {
  id: string
  title: string
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [pendingRedirect, setPendingRedirect] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Listing[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoadingUser(false)
    }
    getUser()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) void performSearch(searchTerm)
      else setSearchResults([])
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const performSearch = async (query: string) => {
    setSearchLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('id, title')
      .ilike('title', `%${query}%`)
      .limit(5)
    if (data) setSearchResults(data as Listing[])
    setSearchLoading(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
    setSearchResults([])
  }

  const handleStartSelling = () => {
    if (user) router.push('/protected/sell')
    else {
      setPendingRedirect(true)
      setShowLogin(true)
    }
  }

  const handleIconClick = () => {
    if (!user) setShowLogin(true)
  }

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden text-gray-700"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
              <span className="text-[#9b4de0]">🛡</span>
              <span className="text-gray-900">jawa</span>
            </Link>
          </div>

          {/* Middle: Search */}
          <div className="hidden sm:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm"
                className="w-full pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#9b4de0] focus:ring-2 focus:ring-[#9b4de0] transition"
              />
            </form>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listing/${item.id}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setSearchResults([])}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
            {searchLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 text-sm text-gray-500 bg-white rounded-lg shadow-lg">
                Searching...
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {loadingUser ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <>
                {/* Buttons container (ALWAYS visible) */}
                <div className="flex gap-3 items-center">
                  {/* <-- REWRITTEN START YOUR BUILD button (strong overrides to force visibility) */}
                  <Link
                    href="/list"
                    aria-label="Start Your Build"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] relative z-30 min-w-[140px]"
                    style={{
                      color: '#ffffff',
                      opacity: 1,
                      visibility: 'visible',
                      // ensure text not clipped/transparent by external styles
                      WebkitTextFillColor: 'white',
                    }}
                  >
                    <span className="mr-2 text-lg" aria-hidden>
                      🚀
                    </span>
                    <span className="whitespace-nowrap" style={{ color: '#ffffff' }}>
                      Xây dựng máy tính 
                    </span>
                  </Link>

   {/* Start Selling (giống hệt Start Your Build) */}
<button
  onClick={handleStartSelling}
  className="inline-flex items-center justify-center bg-[#9b4de0] text-white font-semibold text-sm px-5 py-2 rounded-full cursor-pointer shadow-sm hover:bg-[#873ac7] hover:shadow-lg active:scale-[0.98] transition duration-200 relative z-20"
>
  Bắt đầu bán hàng
</button>

                </div>

                {/* Icons */}
                <Heart
                  className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer"
                  onClick={handleIconClick}
                />
                <Bell
                  className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer"
                  onClick={handleIconClick}
                />
                <ShoppingCart
                  className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer"
                  onClick={handleIconClick}
                />

                {user ? (
                  <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#9b4de0]">
                      <UserIcon className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </HeadlessMenu.Button>
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 text-sm">
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => router.push('/profile')}
                            className={`block w-full px-4 py-2 text-left ${
                              active ? 'bg-gray-100' : ''
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
                            className={`block w-full px-4 py-2 text-left text-red-500 ${
                              active ? 'bg-gray-100' : ''
                            }`}
                          >
                            Sign out
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </HeadlessMenu.Items>
                  </HeadlessMenu>
                ) : (
                  <UserIcon
                    className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer"
                    onClick={handleIconClick}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-2">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings and sellers"
              className="w-full pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm"
            />
          </form>
        </div>
      </header>

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
