'use client';

import { useState } from 'react';
import {
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

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
    <div
      className="max-w-7xl mx-auto px-4 py-8 font-sans"
      style={{
        fontFamily:
          "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        {/* Header */}
        <div className="hidden md:flex bg-gray-50 rounded-t-lg select-none text-[14px] font-semibold uppercase tracking-wide text-gray-600 leading-6">
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
                className="flex bg-white hover:bg-gray-50 transition cursor-pointer"
                style={{ lineHeight: 1.5 }}
              >
                <div className="w-48 px-5 py-4 font-medium flex items-center whitespace-nowrap text-gray-900 text-[14px]">
                  {part.category}
                </div>
                <div
                  className="flex-1 px-5 py-4 flex items-center text-blue-600 hover:underline truncate cursor-pointer text-[14px]"
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
                <div className="w-36 px-5 py-4 truncate flex items-center text-gray-700 text-[14px]">
                  {part.store ?? '-'}
                </div>
                <div className="w-24 px-5 py-4 text-right font-medium flex items-center justify-end text-gray-900 text-[14px]">
                  ${part.price.toFixed(2)}
                </div>
                <div className="w-24 px-5 py-4 text-center flex items-center justify-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      part.status === 'In Stock'
                        ? 'bg-green-100 text-green-700 text-xs'
                        : part.status === 'Out of Stock'
                        ? 'bg-red-100 text-red-700 text-xs'
                        : 'bg-gray-100 text-gray-700 text-xs'
                    }`}
                    style={{ lineHeight: 1.2 }}
                  >
                    {part.status ?? 'Unknown'}
                  </span>
                </div>
                <div className="w-28 px-5 py-4 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => alert('Edit feature coming soon!')}
                    aria-label="Edit Part"
                    className="p-1 rounded hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleRemovePart(part.id)}
                    aria-label="Remove Part"
                    className="p-1 rounded hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div
              key={category}
              className="flex bg-white hover:bg-gray-50 cursor-pointer rounded-none last:rounded-b-lg"
              role="button"
              tabIndex={0}
              onClick={() => handleAddPart(category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleAddPart(category);
              }}
            >
              <div className="w-48 px-5 py-5 font-medium flex items-center text-gray-700 whitespace-nowrap text-[14px]">
                {category}
              </div>
              <div className="flex-1 px-5 py-5 flex items-center justify-center">
                <button
                  className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="button"
                  style={{
                    fontFamily:
                      "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  }}
                >
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
        <div className="flex bg-white font-semibold text-gray-900 rounded-b-lg shadow-inner border-t border-transparent">
          <div className="w-48 px-5 py-4 text-[14px]">Total</div>
          <div className="flex-1 px-5 py-4"></div>
          <div className="w-36 px-5 py-4"></div>
          <div className="w-24 px-5 py-4 text-right text-[14px]">${totalPrice.toFixed(2)}</div>
          <div className="w-24 px-5 py-4"></div>
          <div className="w-28 px-5 py-4"></div>
        </div>
      </div>
    </div>
  );
}
