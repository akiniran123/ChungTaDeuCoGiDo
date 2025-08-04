'use client';

import { UseFormRegister } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
};

export default function ConditionSelector({ register }: Props) {
  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h2 className="font-semibold text-lg">Condition</h2>

      <select
        {...register('condition')}
        className="w-full border rounded px-3 py-2"
      >
        <option value="brand_new">Brand New</option>
        <option value="new_open_box">New - Open Box</option>
        <option value="used_like_new">Used - Like New</option>
        <option value="used_good">Used - Good</option>
        <option value="as_is">As-Is / For Parts</option>
      </select>
    </div>
  );
}
