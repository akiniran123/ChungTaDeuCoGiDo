'use client'

import { useState } from 'react'
import Logo from '@/components/Navbar/LogoSearchIcon/logo'
import SearchBar from '@/components/Navbar/LogoSearchIcon/SearchBar'
import StartSellingButtons from '@/components/Navbar/LogoSearchIcon/StartSellingButtons'
import MessagesMenu from '@/components/Navbar/LogoSearchIcon/MesagesMenu'
import NewsMenu from '@/components/Navbar/LogoSearchIcon/NewsMenu'
import CartMenu from '@/components/Navbar/LogoSearchIcon/CartMenu'
import UserMenu from '@/components/Navbar/LogoSearchIcon/UserMenu'
import LoginModal from '@/components/auth/LoginModal'
import { useRouter } from 'next/navigation'

interface Props {
  onMenuToggle?: () => void
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  const [showLogin, setShowLogin] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)
  const router = useRouter()

  const openLogin = (redirectTo?: string) => {
    setPendingRedirect(redirectTo ?? null)
    setShowLogin(true)
  }

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Logo onMenuToggle={onMenuToggle} />
          <SearchBar />
          <div className="flex items-center gap-3">
            <StartSellingButtons onRequireLogin={() => openLogin('/sell')} />
            <MessagesMenu />
            <NewsMenu />
            <CartMenu />
            <UserMenu onLoginClick={() => openLogin()} />
          </div>
        </div>

        {/* Mobile Search: đơn giản (submit thẳng, không gợi ý) */}
        <div className="sm:hidden px-4 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = (e.currentTarget.elements.namedItem('q') as HTMLInputElement)
              const q = input?.value?.trim()
              if (!q) return
              router.push(`/search?query=${encodeURIComponent(q)}`)
              input.value = ''
            }}
          >
            <input
              name="q"
              type="text"
              placeholder="Search listings and sellers"
              className="w-full pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm"
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
