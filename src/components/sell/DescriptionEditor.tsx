'use client';

import { Controller, Control, FieldError } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  control: Control<ProductFormData>;
  error?: FieldError;
};

export default function DescriptionEditor({ control, error }: Props) {
  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h2 className="font-semibold text-lg">Description</h2>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <textarea
            {...field}
            rows={6}
            placeholder="Describe the product in detail. Markdown supported."
            className="w-full border rounded px-3 py-2"
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
