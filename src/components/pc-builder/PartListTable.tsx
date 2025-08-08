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

// ... import + types vẫn giữ nguyên

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

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8"
      style={{
        fontFamily:
          "'Helvetica Neue', Arial, sans-serif",
        fontSize: 14,
        color: '#222',
      }}
    >
      <div
        className="overflow-x-auto rounded-md"
        style={{
          border: '1px solid #dfe3e8',
          backgroundColor: 'white',
        }}
      >
        {/* Header */}
        {/* giữ nguyên header như trước */}

        {categories.map((category) => {
          const part = parts.find((p) => p.category === category);
          if (part) {
            // render part đã chọn như trước
            return (
              <div
                key={part.id}
                className="flex cursor-pointer"
                style={{
                  borderTop: '1px solid #dfe3e8',
                  padding: '14px 20px',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}
              >
                {/* phần hiển thị part giữ nguyên */}
              </div>
            );
          }
          // Dòng chưa có part - có nút + Add a part bên dưới phần Part Name
          return (
            <div
              key={category}
              className="flex items-start"
              style={{
                backgroundColor: 'white',
                borderTop: '1px solid #dfe3e8',
                padding: '20px',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: 190,
                  fontWeight: 600,
                  color: '#4a4a4a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingTop: 6,
                }}
              >
                {category}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleAddPart(category)}
                  style={{
                    border: '1px solid #0071e3',
                    color: '#0071e3',
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                    padding: '6px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  + Add a part
                </button>
              </div>
              <div style={{ width: 160 }} />
              <div style={{ width: 110 }} />
              <div style={{ width: 110 }} />
              <div style={{ width: 130 }} />
            </div>
          );
        })}

        {/* Total */}
        {/* giữ nguyên phần tổng tiền */}
      </div>
    </div>
  );
}
