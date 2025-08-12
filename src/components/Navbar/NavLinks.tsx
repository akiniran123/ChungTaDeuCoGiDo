'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavLinksProps {
  onLinkClick?: () => void;
}

type NavLink = {
  name: string;
  path: string;
  isNew?: boolean;
};

const mainLinks: NavLink[] = [
  { name: 'Mới', path: '/public/new' },
  { name: 'Máy tính gaming', path: '/public/gaming-pcs' },
  { name: 'GPU', path: '/public/gpus' },
  { name: 'Thành phần', path: '/public/components' },
  { name: 'Thiết bị ngoại vệ', path: '/public/peripherals' },
  { name: 'Hệ thống khác', path: '/public/other-systems' },
  { name: 'Cổ điển', path: '/public/retro', isNew: true },
];

const moreLinks: NavLink[] = [
  { name: 'Thông Tín', path: '/public/about' },
  { name: 'Câu hỏi thường gặp', path: '/public/faq' },
  { name: 'Liên hệ', path: '/public/contact' },
  { name: 'Bán hàng', path: '/public/sell' },
];

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [moreOpen]);

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
    setMobileOpen(false);
    setMoreOpen(false);
  };

  function isActiveLink(path: string) {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }

  return (
    <div className="border-none outline-none">
      {/* Mobile toggle */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center md:hidden border-none outline-none">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="focus:outline-none focus:ring-0 rounded border-none"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="text-sm font-semibold">MENU</span>
      </div>

      {/* Desktop menu */}
      <nav
        className="hidden md:flex justify-center gap-6 font-medium text-sm uppercase tracking-wide py-3 relative border-none outline-none"
        role="menubar"
      >
        {mainLinks.map(({ name, path, isNew }) => {
          const active = isActiveLink(path);
          return (
            <Link
              key={name}
              href={path}
              className={`relative group flex items-center pb-1 transition-colors duration-200
                ${active ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              role="menuitem"
              tabIndex={0}
              aria-current={active ? 'page' : undefined}
              onClick={() => setMoreOpen(false)}
            >
              {isNew ? (
                <span>
                  {name}
                  <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">NEW</span>
                </span>
              ) : (
                name
              )}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300
                  ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          );
        })}

        {/* Dropdown MORE - desktop only */}
        {!isMobile && (
          <div
            className="relative border-none outline-none"
            ref={moreRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMoreOpen(!moreOpen);
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstLink = moreRef.current?.querySelector<HTMLAnchorElement>('a');
                firstLink?.focus();
              }
            }}
          >
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-controls="more-menu"
              className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-blue-500 transition-colors font-medium uppercase text-sm border-none outline-none"
            >
              Danh sách <ChevronDown className="w-4 h-4" />
            </button>

            <div
              id="more-menu"
              role="menu"
              aria-label="More links"
              className={`absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md z-50 min-w-[150px] origin-top transition-transform duration-200
                ${moreOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            >
              {moreLinks.map(({ name, path }) => {
                const active = isActiveLink(path);
                return (
                  <Link
                    key={name}
                    href={path}
                    role="menuitem"
                    tabIndex={moreOpen ? 0 : -1}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition
                      ${active ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden px-4 pb-4 font-semibold text-sm space-y-2 border-none outline-none"
          role="menu"
          aria-label="Mobile menu"
        >
          {[...mainLinks, ...moreLinks].map(({ name, path, isNew }) => {
            const active = isActiveLink(path);
            return (
              <Link
                key={name}
                href={path}
                role="menuitem"
                tabIndex={0}
                onClick={handleLinkClick}
                className={`block py-1 transition-colors duration-150
                  ${active ? 'text-blue-500 underline underline-offset-4' : 'text-gray-900 dark:text-gray-100 hover:text-blue-500'}`}
              >
                {isNew ? (
                  <span>
                    {name}
                    <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">NEW</span>
                  </span>
                ) : (
                  name
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
