"use client";

import SearchBar from "@/components/Navbar/pc/LogoSearchIcon/SearchBar";

interface Props {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

export default function ProductsCategoriesSearch({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div>
      {/* CATEGORY LIST */}
      <div className="flex items-center justify-center text-[12px] overflow-x-auto no-scrollbar px-2 py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-red-100 text-red-700 shadow-sm"
                : "text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="mb-2 py-2 px-2">
        <SearchBar
          userId="demo-user"
          onSearch={(q) => console.log("Searching:", q)}
        />
      </div>
    </div>
  );
}
