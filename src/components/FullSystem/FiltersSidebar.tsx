import React from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  title: string;
  options: FilterOption[];
}

export interface FiltersSidebarProps {
  filters: FilterGroup[];
  onChange: (filterKey: string, value: string) => void;
}

export default function FiltersSidebar({ filters, onChange }: FiltersSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 pr-4 space-y-6">
      {filters.map((group, idx) => (
        <div key={idx}>
          <h3 className="font-medium text-gray-900 mb-2">{group.title}</h3>
          <div className="space-y-1">
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center space-x-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={() => onChange(group.title, opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
