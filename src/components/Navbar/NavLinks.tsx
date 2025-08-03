'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavLinksProps {
  onLinkClick?: () => void;
}

// ✅ Khai báo type có isNew là optional
type NavLink = {
  name: string;
  path: string;
  isNew?: boolean;
};

// Danh sách menu chính
const mainLinks: NavLink[] = [
  { name: 'NEW', path: '/new' },
  { name: 'GAMING PCS', path: '/gaming-pcs' },
  { name: 'GPUS', path: '/gpus' },
  { name: 'COMPONENTS', path: '/components' },
  { name: 'PERIPHERALS', path: '/peripherals' },
  { name: 'OTHER SYSTEMS', path: '/other-systems' },
  { name: 'RETRO', path: '/retro', isNew: true },
];

// Danh sách MORE
const moreLinks: NavLink[] = [
  { name: 'ABOUT', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'CONTACT', path: '/contact' },
  { name: 'SELL', path: '/sell' },
];

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
    else setMobileOpen(false);
  };

  return (
    <div className="border-t dark:border-gray-700">
      {/* Mobile toggle */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="text-sm font-semibold">MENU</span>
      </div>

      {/* Desktop menu */}
      <nav className="hidden md:flex justify-center gap-6 font-semibold text-sm py-3 relative">
        {mainLinks.map(({ name, path, isNew }) => (
          <Link
            key={name}
            href={path}
            className={`hover:text-indigo-600 transition-colors ${
              pathname === path ? 'text-indigo-500 underline underline-offset-4' : ''
            }`}
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
        ))}

        {/* Dropdown MORE */}
        <div
          className="relative"
          onMouseEnter={() => setMoreOpen(true)}
          onMouseLeave={() => setMoreOpen(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
            MORE <ChevronDown className="w-4 h-4" />
          </div>
          {moreOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md z-50 min-w-[150px]">
              {moreLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setMoreOpen(false)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    pathname === path ? 'text-indigo-500 font-medium' : ''
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 font-semibold text-sm space-y-2">
          {[...mainLinks, ...moreLinks].map(({ name, path, isNew }) => (
            <Link
              key={name}
              href={path}
              onClick={handleClick}
              className={`block py-1 ${
                pathname === path ? 'text-indigo-500 underline underline-offset-4' : ''
              }`}
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
          ))}
        </div>
      )}
    </div>
  );
}
