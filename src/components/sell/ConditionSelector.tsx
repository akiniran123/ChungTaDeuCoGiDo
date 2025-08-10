'use client';

import { UseFormRegister } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
};

export default function ConditionSelectorSection({ register }: Props) {
  const options = [
    { value: 'brand_new', label: 'Brand New in Box' },
    { value: 'new_open_box', label: 'New Open Box' },
    { value: 'used_like_new', label: 'Used, Like New' },
    { value: 'used_good', label: 'Used, Good' },
    { value: 'as_is', label: 'As-Is / For Parts' },
  ];

  return (
    <div className="space-y-4">
      <p className="font-medium">Condition <span className="text-red-500">*</span></p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              value={option.value}
              {...register('condition')}
              className="accent-indigo-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
