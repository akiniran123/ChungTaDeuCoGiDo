'use client';

import { useState } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';

type Part = {
  id: string;
  category: string;
  name: string;
  price: number;
  store?: string;
  url?: string;
  status?: 'In Stock' | 'Out of Stock' | 'Unknown';
};

const categories = [
  'CPU',
  'GPU',
  'Memory',
  'Storage',
  'Motherboard',
  'Power Supply',
  'Case',
  'Cooling',
  'Monitor',
  'Operating System',
];

export default function PartListFlex() {
  const [parts, setParts] = useState<Part[]>([]);

  const totalPrice = parts.reduce((sum, p) => sum + p.price, 0);

  function handleAddPart(category: string) {
    const newPart: Part = {
      id: `${category.toLowerCase()}-${Date.now()}`,
      category,
      name: `Example ${category} Part with a somewhat long name to test truncation`,
      price: Math.floor(Math.random() * 300) + 50,
      store: 'Example Store',
      url: '',
      status: 'In Stock',
    };
    setParts([...parts, newPart]);
  }

  function handleRemovePart(id: string) {
    setParts(parts.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white">
        {/* Header */}
        <div className="hidden md:flex bg-white rounded-t-lg select-none font-semibold text-xs uppercase tracking-widest text-gray-700 border-b border-gray-300">
          <div className="w-48 px-5 py-3">Category</div>
          <div className="flex-1 px-5 py-3">Part Name</div>
          <div className="w-36 px-5 py-3">Store</div>
          <div className="w-24 px-5 py-3 text-right">Price</div>
          <div className="w-24 px-5 py-3 text-center">Status</div>
          <div className="w-28 px-5 py-3 text-center">Actions</div>
        </div>

        {/* Rows */}
        {categories.map((category) => {
          const part = parts.find((p) => p.category === category);
          if (part) {
            return (
              <div
                key={part.id}
                className="flex bg-white border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="w-48 px-5 py-4 font-semibold bg-white flex items-center whitespace-nowrap text-gray-900">
                  {part.category}
                </div>
                <div
                  className="flex-1 px-5 py-4 flex items-center text-blue-600 hover:underline truncate cursor-pointer"
                  title={part.name}
                >
                  {part.url ? (
                    <a
                      href={part.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate"
                    >
                      {part.name}
                    </a>
                  ) : (
                    part.name
                  )}
                </div>
                <div className="w-36 px-5 py-4 truncate flex items-center text-gray-700">
                  {part.store ?? '-'}
                </div>
                <div className="w-24 px-5 py-4 text-right font-semibold flex items-center justify-end text-gray-900">
                  ${part.price.toFixed(2)}
                </div>
                <div className="w-24 px-5 py-4 text-center flex items-center justify-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      part.status === 'In Stock'
                        ? 'bg-green-100 text-green-700'
                        : part.status === 'Out of Stock'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {part.status ?? 'Unknown'}
                  </span>
                </div>
                <div className="w-28 px-5 py-4 flex items-center justify-center space-x-3">
                  <button
                    onClick={() => alert('Edit feature coming soon!')}
                    aria-label="Edit Part"
                    className="p-1 rounded hover:bg-blue-50 transition"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleRemovePart(part.id)}
                    aria-label="Remove Part"
                    className="p-1 rounded hover:bg-red-50 transition"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div
              key={category}
              className="flex bg-white border-b border-gray-300 hover:bg-gray-50 cursor-pointer rounded-none last:rounded-b-lg"
              role="button"
              tabIndex={0}
              onClick={() => handleAddPart(category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleAddPart(category);
              }}
            >
              <div className="w-48 px-5 py-5 font-semibold flex items-center text-gray-700 whitespace-nowrap">
                {category}
              </div>
              <div className="flex-1 px-5 py-5 flex items-center justify-center">
                <button
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="button"
                >
                  <PlusIcon className="w-5 h-5" />
                  + Add a part
                </button>
              </div>
              <div className="w-36 px-5 py-5"></div>
              <div className="w-24 px-5 py-5"></div>
              <div className="w-24 px-5 py-5"></div>
              <div className="w-28 px-5 py-5"></div>
            </div>
          );
        })}

        {/* Tổng tiền */}
        <div className="flex bg-white font-semibold text-gray-900 rounded-b-lg border-t border-gray-300 shadow-inner">
          <div className="w-48 px-5 py-4">Total</div>
          <div className="flex-1 px-5 py-4"></div>
          <div className="w-36 px-5 py-4"></div>
          <div className="w-24 px-5 py-4 text-right">${totalPrice.toFixed(2)}</div>
          <div className="w-24 px-5 py-4"></div>
          <div className="w-28 px-5 py-4"></div>
        </div>
      </div>
    </div>
  );
}
