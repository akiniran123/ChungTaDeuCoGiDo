'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

export default function Logo({
  onMenuToggle,
}: {
  onMenuToggle?: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Nút menu trên mobile */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        className="sm:hidden text-gray-700 dark:text-gray-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-2 text-2xl font-bold"
      >
        <span className="text-[#9b4de0]">🛡</span>
        <span className="text-gray-900 dark:text-gray-100">NexLoot</span>
      </Link>
    </div>
  )
}
