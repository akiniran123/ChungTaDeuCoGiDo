"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import TopBar from "./TopBar";
import NavLinks from "./NavLinks";

import Logo from "./LogoSearchIcon/logo";
import SearchBar from "./LogoSearchIcon/SearchBar";
import MessagesMenu from "./LogoSearchIcon/MessagesMenu";
import UserMenu from "./LogoSearchIcon/UserMenu";
import LoginModal from "@/components/auth/pc/LoginModal";

import { AnimatePresence, motion } from "framer-motion";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // 🛒 Lấy tổng số item trong Cart


  // Login
  const openLogin = (redirectTo?: string) => {
    setPendingRedirect(redirectTo ?? null);
    setShowLogin(true);
  };

  // Giỏ hàng

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm h-[6.5rem]">
        {/* Thanh trên */}
        <TopBar />

        {/* --- Logo + Search + Icons (GỘP TỪ LogoSearchIcons) --- */}
        <div className="w-full h-14 px-4 flex items-center relative">
          {/* Logo bên trái */}
          <Logo onMenuToggle={toggleMenu} />

          {/* Search giữa */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
            <SearchBar />
          </div>

          {/* Icons bên phải */}
          <div className="flex items-center gap-3 ml-auto">
            <MessagesMenu />

            {/* Cart */}
         

            {/* User Menu */}
            <UserMenu onLoginClick={() => openLogin()} />
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25 }}
              className="sm:hidden fixed top-0 left-0 h-screen w-full bg-white z-50 overflow-y-auto"
            >
              <div className="p-4 flex justify-end">
                <button
                  onClick={closeMenu}
                  className="text-2xl text-gray-700"
                >
                  ✕
                </button>
              </div>
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Links */}
        <div className="hidden sm:block">
          <NavLinks />
        </div>
      </header>

      {/* Modal Login */}
      {showLogin && (
        <LoginModal
          redirectTo={pendingRedirect ?? undefined}
          onClose={() => {
            setShowLogin(false);
            setPendingRedirect(null);
          }}
        />
      )}
    </>
  );
}
