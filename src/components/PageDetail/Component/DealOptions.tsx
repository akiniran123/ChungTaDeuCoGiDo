"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DealOptions({
  price,
  sizes = [],
  initialSize = null,
  initialQty = 1,
  onAddToCart,
  onBuyNow,
  disabled = false,
}: {
  price: number;
  sizes?: string[];
  initialSize?: string | null;
  initialQty?: number;
  onAddToCart?: (opts: { size?: string | null; qty: number }) => Promise<void> | void;
  onBuyNow?: (opts: { size?: string | null; qty: number }) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [size, setSize] = useState<string | null>(initialSize);
  const [qty, setQty] = useState<number>(Math.max(1, initialQty ?? 1));
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (disabled || loading) return;
    try {
      setLoading(true);
      await onAddToCart?.({ size, qty });
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (disabled || loading) return;
    try {
      setLoading(true);
      await onBuyNow?.({ size, qty });
    } catch (err) {
      console.error("Buy now error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="mb-3">
        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Giá</div>
        <div className="text-2xl font-bold text-indigo-600">
          {price > 0 ? `${price.toLocaleString()}₫` : "Liên hệ"}
        </div>
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Chọn kích cỡ</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                  size === s
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-700 mb-2">Số lượng</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-l-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            aria-label="Giảm"
          >
            −
          </button>
          <div className="w-12 h-10 border-t border-b border-gray-200 flex items-center justify-center font-medium text-gray-800">
            {qty}
          </div>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 rounded-r-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            aria-label="Tăng"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || disabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-indigo-600 bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Thêm vào giỏ"}
        </button>

        <button
          type="button"
          onClick={handleBuy}
          disabled={loading || disabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Mua ngay"}
        </button>
      </div>
    </div>
  );
}