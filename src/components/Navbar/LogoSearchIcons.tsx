'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Heart,
  Bell,
  ShoppingCart,
  User,
  Menu,
  Search,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LoginModal from './LoginModal';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Props {
  onMenuToggle?: () => void;
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      setUser(fetchedUser);
    };
    getUser();
  }, []);

  const handleStartSelling = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (currentUser) {
      router.push('/sell');
    } else {
      setShowLogin(true);
    }
  };

  const handleIconClick = () => setShowLogin(true);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/Logo/anh.png"
                alt="Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search (Desktop only) */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm"
              className="w-full pl-5 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Icons & Bắt đầu bán hàng */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartSelling}
              className="hidden sm:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-sm rounded-full font-semibold transition cursor-pointer"
              aria-label="Bắt đầu bán hàng"
            >
              Bắt đầu bán hàng
            </button>

            <Heart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
            <Bell className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
            <ShoppingCart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
            <User className="w-5 h-5 hover:text-indigo-500 cursor-pointer" onClick={handleIconClick} />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
          />
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            router.push('/sell');
          }}
        />
      )}
    </>
  );
}
