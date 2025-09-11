'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Logo from './LogoSearchIcon/logo'
import SearchBar from './LogoSearchIcon/SearchBar'
import StartSellingButtons from './LogoSearchIcon/StartSellingButtons'
import MessagesMenu from './LogoSearchIcon/MessagesMenu'
import NewsMenu from './LogoSearchIcon/NewsMenu'
import CartMenu from './LogoSearchIcon/CartMenu'
import UserMenu from './LogoSearchIcon/UserMenu'

import LoginModal from '../auth/LoginModal'

export default function LogoSearchIcons({
  onMenuToggle,
}: {
  onMenuToggle?: () => void
}) {
  const [showLogin, setShowLogin] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)
  const router = useRouter()

  const openLogin = (redirectTo?: string) => {
    setPendingRedirect(redirectTo ?? null)
    setShowLogin(true)
  }

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        {/* thêm pr-4 ở đây để cụm icon bên phải không sát viền */}
        <div className="w-full py-3 pl-4 pr-4 flex items-center justify-between gap-4">
          {/* Logo và menu toggle */}
          <Logo onMenuToggle={onMenuToggle} />

          {/* Thanh search desktop */}
          <SearchBar />

          {/* Các nút bên phải */}
          <div className="flex items-center gap-3">
            <StartSellingButtons onRequireLogin={() => openLogin('/sell')} />
            <MessagesMenu />
            <NewsMenu />
            <CartMenu />
            <UserMenu onLoginClick={() => openLogin()} />
          </div>
        </div>

        {/* Thanh search mobile */}
        <div className="sm:hidden px-4 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement | null
              const q = input?.value?.trim()
              if (!q) return
              router.push(`/search?query=${encodeURIComponent(q)}`)
              if (input) input.value = ''
            }}
          >
            <input
              name="q"
              type="text"
              placeholder="Search listings and sellers"
              className="w-full pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm"
            />
          </form>
        </div>
      </header>

      {/* Modal đăng nhập */}
      {showLogin && (
        <LoginModal
          redirectTo={pendingRedirect ?? undefined}
          onClose={() => {
            setShowLogin(false)
            setPendingRedirect(null)
          }}
        />
      )}
    </>
  )
}
