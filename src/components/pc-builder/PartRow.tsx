// src/components/pc-builder/PartRow.tsx
import Link from 'next/link';

type Props = {
  category: string;
};

export default function PartRow({ category }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 font-medium text-blue-600">{category}</td>
      <td className="p-2">
        <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
          + Choose A {category}
        </button>
      </td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
      <td className="p-2 text-gray-500">–</td>
    </tr>
  );
}
