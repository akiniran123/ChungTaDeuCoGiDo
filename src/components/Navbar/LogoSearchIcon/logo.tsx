'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

export default function Logo({
  onMenuToggle,
}: {
  onMenuToggle?: () => void
}) {
  return (
    <div className="flex items-center gap-3 justify-start">
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

      {/* Tải ứng dụng + QR */}
      <div className="flex items-center gap-1">
        <span className="font-semibold text-xs text-white">
          Tải ứng dụng
        </span>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/app"
          alt="QR Code tải ứng dụng"
          className="w-8 h-8 border rounded-md shadow-sm"
        />
      </div>
    </div>
  )
}
