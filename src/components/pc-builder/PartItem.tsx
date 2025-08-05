'use client';

import { PCPart } from '@/types/part';

export default function PartItem({
  part,
  onRemove,
  onClick,
  showRemove = true,
  compact = false,
}: {
  part: PCPart;
  onRemove?: () => void;
  onClick?: () => void;
  showRemove?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 border p-4 rounded-lg hover:bg-accent transition cursor-pointer ${
        compact ? 'text-sm p-3' : ''
      }`}
      onClick={onClick}
    >
      <img
        src={part.imageUrl}
        alt={part.name}
        className={`object-cover rounded ${compact ? 'w-10 h-10' : 'w-16 h-16'}`}
      />
      <div className="flex-1">
        <a
          href={part.productUrl}
          target="_blank"
          onClick={(e) => e.stopPropagation()} // tránh trigger onClick của container
          className="text-blue-500 hover:underline"
        >
          {part.name}
        </a>
        <div className="text-sm text-gray-500">{part.category}</div>
      </div>
      <div className="font-semibold">${part.price.toFixed(2)}</div>
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          Remove
        </button>
      )}
    </div>
  );
}
