"use client";

import { useMemo, useState } from "react";

type Props = {
  price?: number | null;
  sizes?: string[];
};

const SIZE_PRICE_MAP: Record<string, number> = {
  S: 0,
  M: 20000,
  L: 40000,
  XL: 60000,
};

export default function DealOptions({
  price = 0,
  sizes = [],
}: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ✅ FIX CHÍNH Ở ĐÂY
  const basePrice = price ?? 0;

  /**
   * 💰 TÍNH GIÁ CUỐI
   */
  const finalPrice = useMemo(() => {
    const sizeExtra = size ? SIZE_PRICE_MAP[size] ?? 0 : 0;
    return (basePrice + sizeExtra) * quantity;
  }, [basePrice, size, quantity]);

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-5">
      {/* 💰 PRICE */}
      <div>
        <div className="text-sm text-gray-500">Giá</div>

        <div className="text-2xl font-bold text-gray-900">
          {finalPrice.toLocaleString()}₫
        </div>

        {size && SIZE_PRICE_MAP[size] > 0 && (
          <div className="text-sm text-gray-500">
            (+{SIZE_PRICE_MAP[size].toLocaleString()}₫ cho size {size})
          </div>
        )}

        {quantity > 1 && (
          <div className="text-sm text-gray-500">
            ({quantity} ×{" "}
            {(basePrice + (size ? SIZE_PRICE_MAP[size] ?? 0 : 0)).toLocaleString()}
            ₫)
          </div>
        )}
      </div>

      {/* SIZE */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-2 font-medium text-gray-900">
            Kích thước
          </div>

          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => {
              const extra = SIZE_PRICE_MAP[s] ?? 0;

              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 border rounded-md text-sm transition
                    ${
                      size === s
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                >
                  {s}
                  {extra > 0 && (
                    <span className="ml-1 text-xs">
                      +{extra / 1000}k
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div>
        <div className="mb-2 font-medium text-gray-900">
          Số lượng
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 border rounded text-lg"
          >
            −
          </button>

          <span className="w-8 text-center">{quantity}</span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 border rounded text-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
