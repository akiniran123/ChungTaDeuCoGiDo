'use client';

import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Giả sử bạn có list sản phẩm
  const allProducts = [
    { id: 1, name: 'PC Gaming XYZ', category: 'pc' },
    { id: 2, name: 'Áo hoodie', category: 'fashion' },
    { id: 3, name: 'Xe đạp địa hình', category: 'vehicles' },
    { id: 4, name: 'Laptop Dell', category: 'laptops' },
  ];

  const filteredProducts = category
    ? allProducts.filter(p => p.category === category)
    : allProducts;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {category ? `Sản phẩm thuộc ${category}` : 'Tất cả sản phẩm'}
      </h1>
      <ul className="space-y-2">
        {filteredProducts.map(p => (
          <li key={p.id} className="border p-2 rounded">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
