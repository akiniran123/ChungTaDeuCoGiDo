"use client"

import React from "react"

type Chip = {
  key: string
  label: string
  onRemove: () => void
}

export default function FilterChips({ chips }: { chips: Chip[] }) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="text-red-600 font-bold">
            ×
          </button>
        </span>
      ))}
    </div>
  )
}
