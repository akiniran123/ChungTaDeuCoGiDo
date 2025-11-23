'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored === "dark" || (!stored && prefersDark);

    if (shouldUseDark) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const isDark = !dark;
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle Theme"
      className={`
        relative w-12 h-6 rounded-full flex items-center 
        px-1 transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${dark ? 'bg-indigo-600 justify-start' : 'bg-gray-300 justify-end'}
        hover:brightness-110
      `}
    >
      <span
        className={`
          transition-transform duration-300
          w-5 h-5 flex items-center justify-center 
          rounded-full bg-white shadow-md
        `}
      >
        {dark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500 transition-transform duration-300" />
        )}
      </span>
    </button>
  );
}
