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
    <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm dark:border-gray-700 dark:shadow-gray-900">
      <table className="min-w-full text-[14px] font-inter text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 select-none">
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-left">Category</th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-left">Part Name</th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-left">Store</th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-right">Price</th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center">Status</th>
            <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const part = parts.find((p) => p.category === category);

            if (part) {
              return (
                <tr
                  key={part.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-semibold bg-gray-50 dark:bg-gray-900 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {part.category}
                  </td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer max-w-xs truncate">
                    {part.url ? (
                      <Link href={part.url} target="_blank" rel="noopener noreferrer" title={part.name}>
                        {part.name}
                      </Link>
                    ) : (
                      part.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-[120px] truncate">{part.store ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">${part.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center font-semibold whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => alert('Edit feature coming soon!')}
                      aria-label="Edit Part"
                      className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleRemovePart(part.id)}
                      aria-label="Remove Part"
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition ml-1"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              );
            }

            // Nếu chưa có món, hiển thị Add a part button trải rộng các cột bên phải, Category có background riêng
            return (
              <tr
                key={category}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-semibold bg-gray-50 dark:bg-gray-900 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {category}
                </td>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleAddPart(category)}
                    className="inline-block px-5 py-1 font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    + Add a part
                  </button>
                </td>
              </tr>
            );
          })}
          {/* Dòng tổng */}
          <tr className="bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <td className="px-6 py-4 border-t border-gray-300 dark:border-gray-700">Total</td>
            <td colSpan={2} className="border-t border-gray-300 dark:border-gray-700"></td>
            <td className="px-6 py-4 border-t border-gray-300 dark:border-gray-700 text-right">${totalPrice.toFixed(2)}</td>
            <td colSpan={2} className="border-t border-gray-300 dark:border-gray-700"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
