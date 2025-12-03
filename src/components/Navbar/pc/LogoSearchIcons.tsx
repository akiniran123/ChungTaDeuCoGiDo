// src/components/LogoSearchIcons.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Logo from './LogoSearchIcon/logo'
import SearchBar from './LogoSearchIcon/SearchBar'
// ❌ Removed: import StartSellingButtons from './LogoSearchIcon/StartSellingButtons'
import MessagesMenu from './LogoSearchIcon/MessagesMenu'
import NewsMenu from './LogoSearchIcon/NewsMenu'
import CartMenu from './LogoSearchIcon/CartMenu'
import UserMenu from './LogoSearchIcon/UserMenu'

import LoginModal from '@/components/auth/pc/LoginModal'
import { useCart } from '@/app/context/CartContext'

type Props = {
  onMenuToggle?: () => void
  onCartClick?: () => void
  totalItems?: number
}

export default function LogoSearchIcons({
  onMenuToggle,
  onCartClick,
  totalItems,
}: Props) {
  const [showLogin, setShowLogin] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)
  const router = useRouter()

  const { cart } = useCart()
  const computedTotal = typeof totalItems === 'number'
    ? totalItems
    : cart.reduce((sum, item) => sum + item.quantity, 0)

  const openLogin = (redirectTo?: string) => {
    setPendingRedirect(redirectTo ?? null)
    setShowLogin(true)
  }

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick()
      return
    }
    router.push('/gio-hang')
  }

  return (
    <>
      <header className="w-full border-b-[0.5px] border-gray-300 bg-white pb-2 pt-0">
        <div className="w-full py-2 pl-4 pr-4 flex items-center justify-between gap-4">
          <Logo onMenuToggle={onMenuToggle} />
          <SearchBar />

          <div className="flex items-center gap-3">
            {/* ❌ Removed StartSellingButtons here */}

            <MessagesMenu />
            <NewsMenu />

            <div
              className="relative cursor-pointer"
              onClick={handleCartClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCartClick() }}
              aria-label="Xem giỏ hàng"
            >
              <CartMenu />
              {computedTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {computedTotal}
                </span>
              )}
            </div>

            <UserMenu onLoginClick={() => openLogin()} />
          </div>
        </div>

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
