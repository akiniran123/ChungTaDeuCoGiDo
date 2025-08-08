'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  { name: 'NEW', path: '/public/new' },
  { name: 'GAMING PCS', path: '/public/gaming-pcs' },
  { name: 'GPUS', path: '/public/gpus' },
  { name: 'COMPONENTS', path: '/public/components' },
  { name: 'PERIPHERALS', path: '/public/peripherals' },
  { name: 'OTHER SYSTEMS', path: '/public/other-systems' },
  { name: 'RETRO', path: '/public/retro', isNew: true },
];

const moreLinks: NavLink[] = [
  { name: 'ABOUT', path: '/public/about' },
  { name: 'FAQ', path: '/public/faq' },
  { name: 'CONTACT', path: '/public/contact' },
  { name: 'SELL', path: '/publics/sell' },
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
      <nav className="hidden md:flex justify-center gap-6 font-medium text-xs uppercase tracking-wide py-3 relative">
        {mainLinks.map(({ name, path, isNew }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={name}
              href={path}
              className={`relative group flex items-center transition-colors duration-200 
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {isNew ? (
                <span>
                  {name}
                  <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">NEW</span>
                </span>
              ) : (
                name
              )}
              {/* Underline hiệu ứng Jawa.gg */}
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] bg-blue-500 transition-all duration-300 
                  ${isActive ? 'w-full left-0' : 'w-0 group-hover:w-full group-hover:left-0'} transform -translate-x-1/2`}
              />
            </Link>
          );
        })}

        {/* Dropdown MORE */}
        <div
          className="relative group"
          onMouseEnter={() => setMoreOpen(true)}
          onMouseLeave={() => setMoreOpen(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-white transition-colors">
            MORE <ChevronDown className="w-4 h-4" />
          </div>
          {moreOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md z-50 min-w-[150px]">
              {moreLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setMoreOpen(false)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition 
                    ${pathname === path ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
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
                pathname === path ? 'text-blue-500 underline underline-offset-4' : ''
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
