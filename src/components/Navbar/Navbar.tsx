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
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black border-b shadow-sm">
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
            className="sm:hidden fixed top-0 left-0 h-screen w-full bg-white dark:bg-black z-50 overflow-y-auto"
          >
            <div className="p-4 flex justify-end">
              <button
                onClick={closeMenu}
                className="text-2xl text-gray-700 dark:text-gray-300"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <NavLinks onLinkClick={closeMenu} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Nav */}
      <div className="hidden sm:block">
        <NavLinks />
      </div>
      <main className="pt-24">
  {/* Nội dung */}
</main>

    </header>
    
  );
}
