'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import LogoSearchIcons from './LogoSearchIcons';
import NavLinks from './NavLinks';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
        <TopBar />
        <LogoSearchIcons onMenuToggle={toggleMenu} />

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
              {/* ❌ bỏ onLinkClick đi */}
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Nav */}
        <div className="hidden sm:block">
          <NavLinks />
        </div>
      </header>

      {/* ✅ Spacer to prevent content being hidden behind fixed navbar */}
      <div className="h-28 sm:h-[120px]" />
    </>
  );
}
