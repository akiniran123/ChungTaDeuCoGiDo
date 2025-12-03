"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Logo({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 justify-start px-4 py-3">
      {/* Nút menu trên mobile */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        className="sm:hidden text-gray-800"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-3 text-2xl font-extrabold"
      >
        <img
          src="/logo.png"
          alt="NexLoot logo"
          className="w-12 h-12 object-contain"
        />
        <span className="text-gray-800 text-3xl">NexLoot</span>
      </Link>
    </div>
  );
}
