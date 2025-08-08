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
        <div
          className="hidden md:flex select-none"
          style={{
            backgroundColor: '#f6f8fa',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#6b6b6b',
            userSelect: 'none',
          }}
        >
          <div style={{ width: 190, padding: '14px 20px' }}>Category</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>Part Name</div>
          <div style={{ width: 160, padding: '14px 20px' }}>Store</div>
          <div
            style={{ width: 110, padding: '14px 20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
          >
            Price
          </div>
          <div
            style={{ width: 110, padding: '14px 20px', textAlign: 'center' }}
          >
            Status
          </div>
          <div
            style={{ width: 130, padding: '14px 20px', textAlign: 'center' }}
          >
            Actions
          </div>
        </div>

        {/* Rows */}
        {categories.map((category) => {
          const part = parts.find((p) => p.category === category);
          if (part) {
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
                <div
                  style={{
                    width: 190,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  {part.category}
                </div>
                <div
                  style={{
                    flex: 1,
                    color: '#0071e3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={part.name}
                >
                  {part.url ? (
                    <a
                      href={part.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0071e3', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {part.name}
                    </a>
                  ) : (
                    part.name
                  )}
                </div>
                <div
                  style={{
                    width: 160,
                    color: '#444',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {part.store ?? '-'}
                </div>
                <div
                  style={{
                    width: 110,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#222',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${part.price.toFixed(2)}
                </div>
                <div
                  style={{
                    width: 110,
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        part.status === 'In Stock'
                          ? '#dbf3db'
                          : part.status === 'Out of Stock'
                          ? '#f7d7d7'
                          : '#e8e8e8',
                      color:
                        part.status === 'In Stock'
                          ? '#2f7f2f'
                          : part.status === 'Out of Stock'
                          ? '#a33a3a'
                          : '#777777',
                      borderRadius: 12,
                      padding: '2px 8px',
                      fontWeight: 500,
                      fontSize: 12,
                      display: 'inline-block',
                      userSelect: 'none',
                    }}
                  >
                    {part.status ?? 'Unknown'}
                  </span>
                </div>
                <div
                  style={{
                    width: 130,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <button
                    onClick={() => alert('Edit feature coming soon!')}
                    aria-label="Edit Part"
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#0071e3',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemovePart(part.id)}
                    aria-label="Remove Part"
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#d33',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffe6e6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div
              key={category}
              role="button"
              tabIndex={0}
              onClick={() => handleAddPart(category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleAddPart(category);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                cursor: 'pointer',
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
                }}
              >
                {category}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  type="button"
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
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  + Add a part
                </button>
              </div>
              <div style={{ width: 160 }}></div>
              <div style={{ width: 110 }}></div>
              <div style={{ width: 110 }}></div>
              <div style={{ width: 130 }}></div>
            </div>
          );
        })}

        {/* Total */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            fontWeight: 700,
            color: '#222',
            padding: '14px 20px',
            borderTop: '1px solid #dfe3e8',
            userSelect: 'none',
          }}
        >
          <div style={{ width: 190 }}>Total</div>
          <div style={{ flex: 1 }}></div>
          <div style={{ width: 160 }}></div>
          <div
            style={{
              width: 110,
              textAlign: 'right',
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${totalPrice.toFixed(2)}
          </div>
          <div style={{ width: 110 }}></div>
          <div style={{ width: 130 }}></div>
        </div>
      </div>
    </div>
  );
}
