"use client";

import { useMemo, useState } from "react";

type Props = {
  price?: number | null;
};

export default function DealOptions({
  price = 0,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  // ✅ đảm bảo luôn là number
  const basePrice = price ?? 0;

  /**
   * 💰 TÍNH GIÁ CUỐI
   */
  const finalPrice = useMemo(() => {
    return basePrice * quantity;
  }, [basePrice, quantity]);

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-5">
      {/* 💰 PRICE */}
      <div>
        <div className="text-sm text-gray-500">Giá</div>

        <div className="text-2xl font-bold text-gray-900">
          {finalPrice.toLocaleString()}₫
        </div>

        {quantity > 1 && (
          <div className="text-sm text-gray-500">
            ({quantity} × {basePrice.toLocaleString()}₫)
          </div>
        )}
      </div>

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
