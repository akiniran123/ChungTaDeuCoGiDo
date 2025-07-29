'use client';

import Link from 'next/link';

const links = [
  { name: "NEW", path: "/new" },
  { name: "GAMING PCS", path: "/gaming-pcs" },
  { name: "GPUS", path: "/gpus" },
  { name: "COMPONENTS", path: "/components" },
  { name: "PERIPHERALS", path: "/peripherals" },
  { name: "OTHER SYSTEMS", path: "/other-systems" },
  { name: "RETRO", path: "/retro", isNew: true },
  { name: "MORE", path: "/more" },
];

export default function NavLinks() {
  return (
    <nav className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-6 text-sm font-semibold border-t dark:border-gray-700">
      {links.map(({ name, path, isNew }) => (
        <Link
          key={name}
          href={path}
          className="hover:text-indigo-600 transition-colors"
        >
          {isNew ? (
            <span>
              {name}
              <span className="bg-red-500 text-white ml-1 px-1 rounded text-xs align-middle">
                NEW
              </span>
            </span>
          ) : (
            name
          )}
        </Link>
      ))}
    </nav>
  );
}
