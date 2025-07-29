'use client';

import { Heart, Bell, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">jawa</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search listings and sellers"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Heart className="cursor-pointer" />
          <Bell className="cursor-pointer" />
          <ShoppingCart className="cursor-pointer" />
          <User className="cursor-pointer" />
        </div>
      </div>

      {/* Navigation links */}
      <nav className="max-w-7xl mx-auto px-4 py-1 flex gap-6 text-sm font-semibold">
        <a href="#">NEW</a>
        <a href="#">GAMING PCS</a>
        <a href="#">GPUS</a>
        <a href="#">COMPONENTS</a>
        <a href="#">PERIPHERALS</a>
        <a href="#">OTHER SYSTEMS</a>
        <a href="#">RETRO</a>
        <a href="#">MORE</a>
      </nav>
    </header>
  );
}
