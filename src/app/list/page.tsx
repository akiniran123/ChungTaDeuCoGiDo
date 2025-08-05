// src/app/list/page.tsx
'use client';

import { useState } from "react";
import { sampleParts } from "@/data/parts";
import PartItem from "@/components/pc-builder/PartItem";
import { PCPart } from "@/types/part";

export default function ListPage() {
  const [selectedParts, setSelectedParts] = useState<PCPart[]>(sampleParts);

  const handleRemove = (id: string) => {
    setSelectedParts(prev => prev.filter(p => p.id !== id));
  };

  const total = selectedParts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your PC Build</h1>
      {selectedParts.length === 0 ? (
        <p className="text-gray-500">No parts selected.</p>
      ) : (
        selectedParts.map(part => (
          <PartItem
            key={part.id}
            part={part}
            onRemove={() => handleRemove(part.id)}
          />
        ))
      )}
      <div className="text-right font-bold text-xl">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
