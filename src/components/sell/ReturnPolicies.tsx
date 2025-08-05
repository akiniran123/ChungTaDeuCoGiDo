'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type ReturnPoliciesProps = {
  register: UseFormRegister<ProductFormData>;
  error?: FieldError;
};

export function ReturnPolicies({ register, error }: ReturnPoliciesProps) {
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

        {/* Buyer Protection Info */}
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
          <button className="text-indigo-600 font-medium hover:underline">+ ADD POLICY</button>
        </div>

        {/* Return Policy Selector */}
        <div className="col-span-2">
          <label className="font-medium block mb-1">Return Policy</label>
          <select
            {...register('returnPolicy')}
            className="w-full border rounded px-3 py-2"
            defaultValue=""
          >
            <option value="">Select return policy</option>
            <option value="no_returns">Returns not accepted</option>
            <option value="7_days">7-day returns</option>
            <option value="14_days">14-day returns</option>
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ReturnPolicies;
