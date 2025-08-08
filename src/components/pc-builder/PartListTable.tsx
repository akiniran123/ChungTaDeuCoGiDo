'use client';

import Link from 'next/link';

type Part = {
  id: string;
  category: string;
  name: string;
  price: number;
  store?: string;
  url?: string;
};

const parts: Part[] = [
  {
    id: 'cpu',
    category: 'CPU',
    name: 'AMD Ryzen 5 5600X',
    price: 199.99,
    store: 'Amazon',
    url: 'https://www.amazon.com/dp/B08166SLDF',
  },
  {
    id: 'gpu',
    category: 'GPU',
    name: 'NVIDIA GeForce RTX 3060 Ti',
    price: 399.99,
    store: 'Newegg',
    url: 'https://www.newegg.com/p/N82E16814500445',
  },
  {
    id: 'ram',
    category: 'Memory',
    name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200',
    price: 79.99,
    store: 'Corsair',
    url: 'https://www.corsair.com/vengeance-lpx',
  },
];

export default function PartListTable() {
  const totalPrice = parts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Part Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Store
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {parts.map(({ id, category, name, price, store, url }) => (
            <tr key={id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                {url ? (
                  <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                ${price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {store ?? '-'}
              </td>
            </tr>
          ))}
          {/* Tổng giá */}
          <tr className="bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm">Total</td>
            <td></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">${totalPrice.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
