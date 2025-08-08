'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

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

export default function PartListTable() {
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
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm dark:border-gray-700 dark:shadow-gray-900">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-xs font-semibold tracking-wide">
          <tr>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Part Name</th>
            <th className="px-6 py-3">Store</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const part = parts.find((p) => p.category === category);

            if (part) {
              return (
                <tr
                  key={part.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <td className="px-6 py-4 font-medium bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
                    {part.category}
                  </td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline">
                    {part.url ? (
                      <Link href={part.url} target="_blank" rel="noopener noreferrer">
                        {part.name}
                      </Link>
                    ) : (
                      part.name
                    )}
                  </td>
                  <td className="px-6 py-4">{part.store ?? '-'}</td>
                  <td className="px-6 py-4 font-semibold">${part.price.toFixed(2)}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      part.status === 'In Stock'
                        ? 'text-green-600'
                        : part.status === 'Out of Stock'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {part.status ?? 'Unknown'}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => alert('Edit feature coming soon!')}
                      aria-label="Edit Part"
                      className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleRemovePart(part.id)}
                      aria-label="Remove Part"
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={category}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-6 py-4 font-medium bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
                  {category}
                </td>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleAddPart(category)}
                    className="px-4 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    + Add a part
                  </button>
                </td>
              </tr>
            );
          })}

          <tr className="bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <td className="px-6 py-4">Total</td>
            <td></td>
            <td></td>
            <td className="px-6 py-4">${totalPrice.toFixed(2)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
