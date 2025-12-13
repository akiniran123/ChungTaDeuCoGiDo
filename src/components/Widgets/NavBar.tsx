// components/Trang_chu/pc/HeaderBar.tsx
"use client";

import SearchBar from "@/components/Navbar/pc/LogoSearchIcon/SearchBar";
import { motion } from "framer-motion";
import React from "react";
import { useScrollNavBar } from "@/hooks/useScrollNavBar";

type Props = {
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  categories?: string[];
};

export default function NavBar({
  selectedCategory,
  setSelectedCategory,
  categories = [
    "Saved",
    "Electronics",
    "Motors",
    "Fashion",
    "Collectibles & Art",
    "Sports",
    "Health & Beauty",
    "Industrial equipment",
    "Home & Garden",
  ],
}: Props) {
  const { showHeader, scrollPosition } = useScrollNavBar();

  // Nếu header đang ẩn thì không render (giữ hành vi cũ)
  if (!showHeader) return null;

 

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-30 bg-white"
      role="navigation"
      aria-label="Main categories and controls"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-center justify-center text-[12px] overflow-x-auto no-scrollbar px-2 py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat ? "bg-red-100 text-red-700 shadow-sm " : "text-gray-700 "
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-2 py-2 px-2">
        <SearchBar userId={"demo-user"} onSearch={(q) => console.log("Searching:", q)} />
      </div>
    </motion.nav>
  );
}