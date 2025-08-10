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
  Search,
} from 'lucide-react'
import { Menu as HeadlessMenu } from '@headlessui/react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

import ThemeToggle from './ThemeToggle'
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        void performSearch(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const performSearch = async (query: string) => {
    setSearchLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('id, title')
      .ilike('title', `%${query}%`)
      .limit(5)

    if (!error && data) {
      setSearchResults(data as Listing[])
    }
    setSearchLoading(false)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTerm.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
      setSearchResults([])
    }
  }

  const handleStartSelling = () => {
    if (user) {
      router.push('/protected/sell')
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
      <div className="w-full border-b border-gray-200 dark:border-gray-700 relative">
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

          {/* Middle: Search (Desktop) */}
          <div className="hidden sm:block flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings and sellers"
                className="w-full pl-11 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </form>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-1 overflow-hidden z-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listing/${item.id}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    onClick={() => setSearchResults([])}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
            {searchLoading && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-1 p-2 text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            )}
          </div>

          {/* Right: Icons */}
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

                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 text-sm">
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
        <div className="sm:hidden px-4 pb-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings and sellers"
              className="w-full pl-11 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            />
          </form>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-1 overflow-hidden z-50">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  onClick={() => setSearchResults([])}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

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
