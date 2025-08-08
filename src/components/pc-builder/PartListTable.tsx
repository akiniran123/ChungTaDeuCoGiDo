'use client';

import Link from 'next/link';
import { useState } from 'react';

type Part = {
  id: string;
  category: string;
  name: string;
  price: number;
  store?: string;
  url?: string;
  status?: string;
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
  const [parts, setParts] = useState<Part[]>([]); // bắt đầu với rỗng

  const totalPrice = parts.reduce((sum, p) => sum + p.price, 0);

  // Hàm giả lập thêm part (bạn thay bằng modal chọn món thật)
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

  // Xóa món
  function handleRemovePart(id: string) {
    setParts(parts.filter((p) => p.id !== id));
  }

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg dark:border-gray-700">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-xs font-semibold tracking-wide">
          <tr>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Part Name</th>
            <th className="px-5 py-3">Store</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const part = parts.find((p) => p.category === category);
            if (part) {
              return (
                <tr
                  key={part.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-5 py-3 font-medium bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
                    {part.category}
                  </td>
                  <td className="px-5 py-3 text-blue-600 dark:text-blue-400 hover:underline">
                    {part.url ? (
                      <Link href={part.url} target="_blank" rel="noopener noreferrer">
                        {part.name}
                      </Link>
                    ) : (
                      part.name
                    )}
                  </td>
                  <td className="px-5 py-3">{part.store ?? '-'}</td>
                  <td className="px-5 py-3 font-semibold">${part.price.toFixed(2)}</td>
                  <td
                    className={`px-5 py-3 font-semibold ${
                      part.status === 'In Stock' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {part.status ?? 'Unknown'}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => alert('Edit feature coming soon!')}
                      className="mr-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemovePart(part.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            }
            // Nếu chưa chọn món trong category thì show nút Add
            return (
              <tr
                key={category}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-5 py-3 font-medium bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
                  {category}
                </td>
                <td colSpan={5} className="px-5 py-3 text-center">
                  <button
                    onClick={() => handleAddPart(category)}
                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-800"
                  >
                    + Add a part
                  </button>
                </td>
              </tr>
            );
          })}
          {/* Tổng giá */}
          <tr className="bg-gray-200 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <td className="px-5 py-3">Total</td>
            <td></td>
            <td></td>
            <td className="px-5 py-3">${totalPrice.toFixed(2)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
