'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
  error?: FieldError;
};

export default function ProductVideoInput({ register, error }: Props) {
  return (
    <div className="space-y-2 border rounded p-5">
      <label className="block font-semibold">
        Product video <span className="text-gray-500 text-sm">(optional)</span>
      </label>

      <input
        type="url"
        {...register('videoUrl')}
        placeholder="https://www.youtube.com/watch?v=example"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <p className="text-sm text-gray-500">
        Only YouTube video links are supported. Paste a valid video URL here if you want to include a product demo.
      </p>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
