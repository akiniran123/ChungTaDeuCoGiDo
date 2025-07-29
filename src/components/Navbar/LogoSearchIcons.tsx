'use client';
import { Heart, Bell, ShoppingCart, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function LogoSearchIcons() {
  return (
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <span className="text-[#9b4de0]">🛡</span>
        <span className="text-black dark:text-white">jawa</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-6">
        <input
          type="text"
          placeholder="Search listings and sellers"
          className="w-full px-5 py-2 rounded-full border border-gray-300 focus:outline-none bg-gray-100 dark:bg-gray-800 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-full font-semibold hover:bg-indigo-700">
          START SELLING
        </button>
        <Heart className="cursor-pointer" />
        <Bell className="cursor-pointer" />
        <ShoppingCart className="cursor-pointer" />
        <User className="cursor-pointer" />
        <ThemeToggle />
      </div>
    </div>
  );
}
