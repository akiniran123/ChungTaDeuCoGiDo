'use client';

import { FieldError, UseFormRegister } from 'react-hook-form';
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
        <div>
          <p className="font-medium">Return Address</p>
          <p className="text-sm text-gray-600">
            Return address must be the same as shipping address. Update your shipping address to change.
          </p>
        </div>
        <div className="text-gray-600">Please select address first</div>

        <div>
          <label className="font-medium">Return Policy</label>
          <select
            {...register('returnPolicy')}
            className="w-full border rounded px-3 py-2"
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
