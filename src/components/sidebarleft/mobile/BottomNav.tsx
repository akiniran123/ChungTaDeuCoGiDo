"use client";

import Link from "next/link";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-slate-100 shadow-lg rounded-t-xl z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative mx-auto max-w-md px-4">
        {/* Navigation bar */}
        <div className="py-3 flex justify-between items-center">
          {/* Home */}
          <Link
            href="/"
            className={clsx(
              "flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105 active:scale-95",
              isActive("/") ? "text-black" : "text-gray-500 hover:text-black"
            )}
            aria-label="Home"
          >
            <Home className="w-6 h-6" />
          </Link>

          {/* Search */}
          <Link
            href="/search"
            className={clsx(
              "mr-12 flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105 active:scale-95",
              isActive("/search") ? "text-black" : "text-gray-500 hover:text-black"
            )}
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </Link>

          {/* Floating Action Button */}
          <Link
            href="/create"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-7 bg-gradient-to-br from-cyan-600 to-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl ring-2 ring-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Create"
          >
            <Plus className="w-7 h-7" />
          </Link>

          {/* Messages */}
          <Link
            href="/messages"
            className={clsx(
              "ml-12 flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105 active:scale-95",
              isActive("/messages") ? "text-black" : "text-gray-500 hover:text-black"
            )}
            aria-label="Messages"
          >
            <MessageCircle className="w-6 h-6" />
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className={clsx(
              "flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105 active:scale-95",
              isActive("/profile") ? "text-black" : "text-gray-500 hover:text-black"
            )}
            aria-label="Profile"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
}