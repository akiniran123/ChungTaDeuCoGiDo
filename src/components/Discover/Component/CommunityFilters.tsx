import { Search, Filter } from "lucide-react";

interface CommunityFiltersProps {
  query: string;
  setQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function CommunityFilters({
  query,
  setQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: CommunityFiltersProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, mô tả hoặc chủ đề..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}