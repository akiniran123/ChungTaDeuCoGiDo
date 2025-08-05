'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

export function PriceAndOffers({
  register,
  errors,
}: {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}) {
  return (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <label className="font-medium">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register('price')}
          className="w-full border rounded px-3 py-2"
          min={0}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Do not include shipping. Fees: 3% processing, 9% platform.
        </p>
      </div>

      {/* Enable Offers */}
      <div className="flex items-center gap-3">
        <label className="font-medium">Enable Offers</label>
        <input
          type="checkbox"
          {...register('enableOffers')}
          className="scale-125"
        />
      </div>

      {/* Minimum Offer */}
      <div>
        <label className="font-medium">Minimum Offer</label>
        <input
          type="number"
          {...register('minOffer')}
          className="w-full border rounded px-3 py-2"
          min={0}
        />
        {errors.minOffer && (
          <p className="text-red-500 text-sm">{errors.minOffer.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="font-medium">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register('quantity')}
          className="w-full border rounded px-3 py-2"
          min={1}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
      </div>

      {/* SKU */}
      <div>
        <label className="font-medium">SKU</label>
        <input
          type="text"
          {...register('sku')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.sku && (
          <p className="text-red-500 text-sm">{errors.sku.message}</p>
        )}
      </div>
    </div>
  );
}
