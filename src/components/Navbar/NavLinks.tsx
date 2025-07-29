'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const links = [
  { name: "NEW", path: "/new" },
  { name: "GAMING PCS", path: "/gaming-pcs" },
  { name: "GPUS", path: "/gpus" },
  { name: "COMPONENTS", path: "/components" },
  { name: "PERIPHERALS", path: "/peripherals" },
  { name: "OTHER SYSTEMS", path: "/other-systems" },
  { name: "RETRO", path: "/retro", isNew: true },
];

const moreLinks = [
  { name: "ABOUT", path: "/about" },
  { name: "FAQ", path: "/faq" },
  { name: "CONTACT", path: "/contact" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // ❗ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-6 text-sm font-semibold border-t dark:border-gray-700 relative">
      {/* Main Links */}
      <ul className="flex flex-wrap items-center gap-6">
        {links.map(({ name, path, isNew }) => (
          <li key={name}>
            <Link
              href={path}
              className={`transition-colors hover:text-indigo-600 ${
                pathname === path ? 'text-indigo-500 underline underline-offset-4' : ''
              }`}
            >
              {isNew ? (
                <span>
                  {name}
                  <span className="bg-red-500 text-white ml-1 px-1 rounded text-xs align-middle">NEW</span>
                </span>
              ) : (
                name
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* MORE Dropdown */}
      <div
        ref={moreRef}
        className="relative cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1 hover:text-indigo-600">
          MORE
          <ChevronDown className="w-4 h-4" />
        </div>

        {isOpen && (
          <ul className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 border dark:border-gray-700">
            {moreLinks.map(({ name, path }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    pathname === path ? 'text-indigo-500 font-medium' : ''
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
