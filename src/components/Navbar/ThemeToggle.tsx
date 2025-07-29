'use client';
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  return (
    <div className="ml-2">
      <button
        onClick={toggle}
        className={`relative w-10 h-5 rounded-full flex items-center px-1 ${
          dark ? "bg-indigo-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full transition-transform ${
            dark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
