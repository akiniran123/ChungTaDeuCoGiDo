import React from "react";

interface SortDropdownProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export default function SortDropdown({ options, onChange }: SortDropdownProps) {
  return (
    <div className="mb-4 flex justify-end">
      <select
        className="border border-gray-300 rounded px-3 py-2 text-sm"
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
