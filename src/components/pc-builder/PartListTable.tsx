// src/components/pc-builder/PartListTable.tsx
import PartRow from './PartRow';

const categories = [
  'CPU',
  'Cooler',
  'Motherboard',
  'RAM',
  'Storage',
  'GPU',
  'Case',
  'PSU',
  'Operating System',
  'Monitor',
];

export default function PartListTable() {
  return (
    <table className="w-full text-sm border-collapse">
      <thead className="text-left bg-gray-100">
        <tr className="border-b">
          <th className="p-2">Component</th>
          <th className="p-2">Selection</th>
          <th className="p-2">Base</th>
          <th className="p-2">Promo</th>
          <th className="p-2">Shipping</th>
          <th className="p-2">Tax</th>
          <th className="p-2">Availability</th>
          <th className="p-2">Price</th>
          <th className="p-2">Where</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <PartRow key={category} category={category} />
        ))}
      </tbody>
    </table>
  );
}
