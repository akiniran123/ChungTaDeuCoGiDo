'use client';

import Link from 'next/link';

type Part = {
  id: string;
  category: string;
  name: string;
  price: number;
  store?: string;
  url?: string;
  status?: string; // e.g. "In Stock", "Out of Stock"
  notes?: string;
};

const parts: Part[] = [
  {
    id: 'cpu',
    category: 'CPU',
    name: 'AMD Ryzen 5 5600X',
    price: 199.99,
    store: 'Amazon',
    url: 'https://www.amazon.com/dp/B08166SLDF',
    status: 'In Stock',
  },
  {
    id: 'gpu',
    category: 'GPU',
    name: 'NVIDIA GeForce RTX 3060 Ti',
    price: 399.99,
    store: 'Newegg',
    url: 'https://www.newegg.com/p/N82E16814500445',
    status: 'Out of Stock',
  },
  {
    id: 'ram',
    category: 'Memory',
    name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200',
    price: 79.99,
    store: 'Corsair',
    url: 'https://www.corsair.com/vengeance-lpx',
    status: 'In Stock',
  },
];

export default function PartListTable() {
  const totalPrice = parts.reduce((sum, part) => sum + part.price, 0);

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
          </tr>
        </thead>
        <tbody>
          {parts.map(({ id, category, name, price, store, url, status }) => (
            <tr
              key={id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-5 py-3 font-medium bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
                {category}
              </td>
              <td className="px-5 py-3 text-blue-600 dark:text-blue-400 hover:underline">
                {url ? (
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </td>
              <td className="px-5 py-3">{store ?? '-'}</td>
              <td className="px-5 py-3 font-semibold">${price.toFixed(2)}</td>
              <td
                className={`px-5 py-3 font-semibold ${
                  status === 'In Stock' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {status ?? 'Unknown'}
              </td>
            </tr>
          ))}

          <tr className="bg-gray-200 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
            <td className="px-5 py-3">Total</td>
            <td></td>
            <td></td>
            <td className="px-5 py-3">${totalPrice.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
