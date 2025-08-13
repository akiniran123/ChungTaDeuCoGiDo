'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
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

/* --- Demo types cho popup --- */
interface MessagePreview {
  id: string
  sellerName: string
  lastMessage: string
  time: string
  unread: number
}
interface NewsItem {
  id: string
  title: string
  time: string
  href: string
}
interface CartItem {
  id: string
  title: string
  price: number
  qty: number
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [pendingRedirect, setPendingRedirect] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Listing[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Badge tin nhắn và thông báo
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNews, setUnreadNews] = useState(0)

  // Popup states
  const [openMessages, setOpenMessages] = useState(false)
  const [openNews, setOpenNews] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const newsRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  // Demo data (thay bằng API/DB của bạn sau)
  const [messageList, setMessageList] = useState<MessagePreview[]>([])
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'p1', title: 'CPU Ryzen 7 7800X3D', price: 9990000, qty: 1 },
    { id: 'p2', title: 'RAM DDR5 32GB 6000MHz', price: 2290000, qty: 2 },
  ])

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

  // Demo: load danh sách & badge từ user
  useEffect(() => {
    if (user) {
      setMessageList([
        { id: 'c1', sellerName: 'Shop ABC', lastMessage: 'Chào bạn, sản phẩm còn...', time: '2 phút', unread: 2 },
        { id: 'c2', sellerName: 'LaptopPro', lastMessage: 'Đã gửi báo giá...', time: '1 giờ', unread: 0 },
        { id: 'c3', sellerName: 'Phụ kiện 24h', lastMessage: 'Tặng mã giảm giá...', time: 'Hôm qua', unread: 1 },
      ])
    } else {
      setMessageList([])
    }

    setNewsList([
      { id: 'n1', title: 'Flash sale laptop cuối tuần', time: '5 phút', href: '/tin-tuc/n1' },
      { id: 'n2', title: 'Ra mắt RTX 5090', time: '1 giờ', href: '/tin-tuc/n2' },
      { id: 'n3', title: 'Cập nhật chính sách đổi trả', time: 'Hôm qua', href: '/tin-tuc/n3' },
    ])
  }, [user])

  useEffect(() => {
    // số hội thoại có tin chưa đọc
    setUnreadMessages(messageList.filter(m => m.unread > 0).length)
  }, [messageList])

  useEffect(() => {
    // ví dụ: coi tất cả tin trong newsList là chưa đọc
    setUnreadNews(newsList.length > 0 ? Math.min(newsList.length, 9) : 0)
  }, [newsList])

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (messagesRef.current && !messagesRef.current.contains(t)) setOpenMessages(false)
      if (newsRef.current && !newsRef.current.contains(t)) setOpenNews(false)
      if (cartRef.current && !cartRef.current.contains(t)) setOpenCart(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const cartTotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0)

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
                {/* Buttons */}
                <div className="flex gap-3 items-center">
                  <Link
                    href="/list"
                    aria-label="Start Your Build"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] relative z-30 min-w-[140px]"
                    style={{
                      color: '#ffffff',
                      opacity: 1,
                      visibility: 'visible',
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

                  <button
                    onClick={handleStartSelling}
                    className="inline-flex items-center justify-center bg-[#9b4de0] text-white font-semibold text-sm px-5 py-2 rounded-full cursor-pointer shadow-sm hover:bg-[#873ac7] hover:shadow-lg active:scale-[0.98] transition duration-200 relative z-20"
                  >
                    Bắt đầu bán hàng
                  </button>
                </div>

                {/* Icons with mini popups */}
                {/* Messages */}
                <div className="relative" ref={messagesRef}>
                  <button
                    type="button"
                    className="relative"
                    onClick={() => {
                      setOpenMessages(v => !v)
                      setOpenNews(false)
                      setOpenCart(false)
                    }}
                    aria-label="Tin nhắn"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        {unreadMessages}
                      </span>
                    )}
                  </button>

                  {openMessages && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="text-sm font-semibold">Tin nhắn</span>
                        <button
                          className="text-xs text-[#9b4de0] hover:underline"
                          onClick={() => router.push('/messages')}
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <ul className="max-h-80 overflow-auto">
                        {messageList.length === 0 ? (
                          <li className="p-4 text-sm text-gray-500">Chưa có tin nhắn.</li>
                        ) : (
                          messageList.map((m) => (
                            <li key={m.id}>
                              <button
                                onClick={() => router.push(`/messages/${m.id}`)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                              >
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                  {m.sellerName.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{m.sellerName}</span>
                                    <span className="text-[11px] text-gray-400 ml-2 shrink-0">{m.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">{m.lastMessage}</p>
                                  {m.unread > 0 && (
                                    <span className="mt-1 inline-block text-[10px] bg-red-500 text-white rounded-full px-2 py-0.5">
                                      Mới
                                    </span>
                                  )}
                                </div>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* News */}
                <div className="relative" ref={newsRef}>
                  <button
                    type="button"
                    className="relative"
                    onClick={() => {
                      setOpenNews(v => !v)
                      setOpenMessages(false)
                      setOpenCart(false)
                    }}
                    aria-label="Tin tức"
                  >
                    <Bell className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer" />
                    {unreadNews > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        {unreadNews}
                      </span>
                    )}
                  </button>

                  {openNews && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="text-sm font-semibold">Tin tức</span>
                        <button
                          className="text-xs text-[#9b4de0] hover:underline"
                          onClick={() => router.push('/tin-tuc')}
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <ul className="max-h-80 overflow-auto">
                        {newsList.length === 0 ? (
                          <li className="p-4 text-sm text-gray-500">Chưa có thông báo.</li>
                        ) : (
                          newsList.map((n) => (
                            <li key={n.id}>
                              <button
                                onClick={() => router.push(n.href || `/tin-tuc/${n.id}`)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{n.title}</p>
                                    <p className="text-xs text-gray-500">{n.time}</p>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative" ref={cartRef}>
                  <button
                    type="button"
                    className="relative"
                    onClick={() => {
                      setOpenCart(v => !v)
                      setOpenMessages(false)
                      setOpenNews(false)
                    }}
                    aria-label="Giỏ hàng"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[#9b4de0] cursor-pointer" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  {openCart && (
                    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="text-sm font-semibold">Giỏ hàng</span>
                        <button
                          className="text-xs text-[#9b4de0] hover:underline"
                          onClick={() => router.push('/gio-hang')}
                        >
                          Xem giỏ hàng
                        </button>
                      </div>
                      <ul className="max-h-80 overflow-auto divide-y">
                        {cartItems.length === 0 ? (
                          <li className="p-4 text-sm text-gray-500">Giỏ hàng trống.</li>
                        ) : (
                          cartItems.map((it) => (
                            <li key={it.id} className="px-4 py-3 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{it.title}</p>
                                <p className="text-xs text-gray-500">Số lượng: x{it.qty}</p>
                              </div>
                              <div className="text-sm font-semibold shrink-0">
                                {(it.price * it.qty).toLocaleString('vi-VN')}₫
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                      {cartItems.length > 0 && (
                        <div className="px-4 py-3 border-t">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Tổng</span>
                            <span className="font-semibold">{cartTotal.toLocaleString('vi-VN')}₫</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push('/gio-hang')}
                              className="flex-1 inline-flex items-center justify-center rounded-full bg-[#9b4de0] text-white text-sm px-4 py-2 hover:bg-[#873ac7]"
                            >
                              Xem giỏ hàng
                            </button>
                            {/* Nếu chưa có trang thanh toán, bạn có thể ẩn nút này */}
                            {/* <button
                              onClick={() => router.push('/checkout')}
                              className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm px-4 py-2 hover:bg-blue-700"
                            >
                              Thanh toán
                            </button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                            className={`block w-full px-4 py-2 text-left ${active ? 'bg-gray-100' : ''}`}
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
                            className={`block w-full px-4 py-2 text-left text-red-500 ${active ? 'bg-gray-100' : ''}`}
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
                    onClick={() => setShowLogin(true)}
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
