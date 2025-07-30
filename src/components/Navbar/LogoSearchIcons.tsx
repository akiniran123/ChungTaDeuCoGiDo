'use client';

import Link from 'next/link';
import { Heart, Bell, ShoppingCart, User, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface Props {
  onMenuToggle?: () => void;
}

export default function LogoSearchIcons({ onMenuToggle }: Props) {
  return (
    <div className="w-full border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle button */}
          <button
            className="sm:hidden text-gray-700 dark:text-gray-300"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
            <span className="text-[#9b4de0]">🛡</span>
            <span className="text-black dark:text-white">jawa</span>
          </Link>
        </div>

        {/* Search (Desktop only) */}
        <div className="hidden sm:block flex-1 max-w-xl mx-4">
          <input
            type="text"
            placeholder="Search listings and sellers"
            className="w-full px-5 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
          />
        </div>

        {/* Action Icons + Theme */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-block bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-full font-semibold hover:bg-indigo-700 transition">
            START SELLING
          </button>

          <Heart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-indigo-500 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 hover:text-indigo-500 cursor-pointer" />
          <User className="w-5 h-5 hover:text-indigo-500 cursor-pointer" />
          <ThemeToggle />
        </div>
      </div>

      {/* Search (Mobile only) */}
      <div className="sm:hidden px-4 pb-2">
        <input
          type="text"
          placeholder="Search listings and sellers"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
        />
      </div>
    </div>
  );
}
