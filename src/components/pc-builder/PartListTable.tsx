'use client';

import { useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

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
      name: `Example ${category} Part`,
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-2">
      {/* Header row */}
      <div className="hidden md:flex bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wide rounded-t-md select-none">
        <div className="w-48 px-4 py-3 border-r border-gray-200 dark:border-gray-700">Category</div>
        <div className="flex-1 px-4 py-3 border-r border-gray-200 dark:border-gray-700">Part Name</div>
        <div className="w-36 px-4 py-3 border-r border-gray-200 dark:border-gray-700">Store</div>
        <div className="w-24 px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-right">Price</div>
        <div className="w-24 px-4 py-3 border-r border-gray-200 dark:border-gray-700 text-center">Status</div>
        <div className="w-28 px-4 py-3 text-center">Actions</div>
      </div>

      {/* Rows */}
      {categories.map((category) => {
        const part = parts.find((p) => p.category === category);
        if (part) {
          return (
            <div
              key={part.id}
              className="flex bg-white dark:bg-gray-900 rounded-md shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <div className="w-48 px-4 py-3 font-semibold bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center">
                {part.category}
              </div>
              <div className="flex-1 px-4 py-3 border-r border-gray-200 dark:border-gray-700 flex items-center text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                {part.url ? (
                  <a href={part.url} target="_blank" rel="noopener noreferrer" title={part.name}>
                    {part.name}
                  </a>
                ) : (
                  part.name
                )}
              </div>
              <div className="w-36 px-4 py-3 border-r border-gray-200 dark:border-gray-700 flex items-center truncate">
                {part.store ?? '-'}
              </div>
              <div className="w-24 px-4 py-3 border-r border-gray-200 dark:border-gray-700 font-semibold text-right flex items-center justify-end">
                ${part.price.toFixed(2)}
              </div>
              <div className="w-24 px-4 py-3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    part.status === 'In Stock'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                      : part.status === 'Out of Stock'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400'
                  }`}
                >
                  {part.status ?? 'Unknown'}
                </span>
              </div>
              <div className="w-28 px-4 py-3 flex items-center justify-center space-x-2">
                <button
                  onClick={() => alert('Edit coming soon')}
                  aria-label="Edit"
                  className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                >
                  <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleRemovePart(part.id)}
                  aria-label="Remove"
                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
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
            className="flex bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer"
          >
            <div className="w-48 px-4 py-4 font-semibold flex items-center border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              {category}
            </div>
            <div
              className="flex-1 px-4 py-4 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => handleAddPart(category)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              + Add a part
            </div>
            <div className="w-36 px-4 py-4 border-l border-gray-200 dark:border-gray-700"></div>
            <div className="w-24 px-4 py-4 border-l border-gray-200 dark:border-gray-700"></div>
            <div className="w-24 px-4 py-4 border-l border-gray-200 dark:border-gray-700"></div>
            <div className="w-28 px-4 py-4 border-l border-gray-200 dark:border-gray-700"></div>
          </div>
        );
      })}

      {/* Total row */}
      <div className="flex bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100 rounded-b-md shadow-inner">
        <div className="w-48 px-4 py-3 border-r border-gray-300 dark:border-gray-700">Total</div>
        <div className="flex-1 px-4 py-3 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="w-36 px-4 py-3 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="w-24 px-4 py-3 border-r border-gray-300 dark:border-gray-700 text-right">${totalPrice.toFixed(2)}</div>
        <div className="w-24 px-4 py-3 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="w-28 px-4 py-3"></div>
      </div>
    </div>
  );
}
