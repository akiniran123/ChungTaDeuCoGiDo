'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
  error?: FieldError;
};

export default function ReturnPolicies({ register, error }: Props) {
  return (
    <div className="space-y-6 border rounded p-5">
      <h2 className="font-semibold text-lg">Return Policies</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Return Address */}
        <div>
          <p className="font-medium">Return Address</p>
          <p className="text-sm text-gray-600">
            Return address must be the same as shipping address. Update your shipping address to change.
          </p>
        </div>
        <div className="text-gray-600">Please select address first</div>

        {/* Buyer Protection Policy */}
        <div>
          <p className="font-medium">Buyer Protection Policy</p>
          <p className="text-sm text-gray-600">
            Select a buyer protection for this item.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">🛡️ Jawa Buyer Protection</p>
            <p className="text-sm text-gray-600">
              Buyer can get a full refund if item never arrived, is damaged, or doesn’t match description within 48h.
            </p>
          </div>
          <button className="text-indigo-600 font-medium">+ ADD POLICY</button>
        </div>

        {/* Return Policy Selection */}
        <div className="col-span-2">
          <p className="font-medium mb-1">Returns Policy</p>
          <p className="text-sm text-gray-600 mb-2">Choose a return policy for this listing.</p>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="no_returns" {...register('returnPolicy')} />
              <span>Returns not accepted</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="7_day_return" {...register('returnPolicy')} />
              <span>7-day return window</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="30_day_return" {...register('returnPolicy')} />
              <span>30-day return window</span>
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      </div>
    </div>
  );
}
