'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import LogoSearchIcons from './LogoSearchIcons';
import NavLinks from './NavLinks';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/app/context/CartContext'; // ✅ import CartContext

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // ✅ Lấy giỏ hàng từ context
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <TopBar />
        <div className="flex items-center justify-between">
          <LogoSearchIcons onMenuToggle={toggleMenu} />

          {/* ✅ Chỉ hiển thị số lượng giỏ hàng, không có icon */}
          {totalItems > 0 && (
            <div className="mr-4 sm:mr-6">
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {totalItems} sản phẩm
              </span>
            </div>
          )}
        </div>

        {/* ✅ Mobile Nav with animation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25 }}
              className="sm:hidden fixed top-0 left-0 h-screen w-full bg-white z-50 overflow-y-auto"
            >
              <div className="p-4 flex justify-end">
                <button
                  onClick={closeMenu}
                  className="text-2xl text-gray-700"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Nav */}
        <div className="hidden sm:block">
          <NavLinks />
        </div>
      </header>

      {/* ✅ Spacer để tránh content bị che bởi fixed navbar */}
      <div className="h-28 sm:h-[120px]" />
    </>
  );
}
