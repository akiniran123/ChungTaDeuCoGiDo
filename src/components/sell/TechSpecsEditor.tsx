'use client';

import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  control: Control<ProductFormData>;
};

export default function TechSpecsEditor({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specs',
  });

  const specs = useWatch({ control, name: 'specs' });

  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h2 className="font-semibold text-lg">Tech Specs</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Key (e.g. CPU)"
            {...control.register(`specs.${index}.key`)}
            className="w-1/3 border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Value (e.g. Intel i7)"
            {...control.register(`specs.${index}.value`)}
            className="w-2/3 border rounded px-3 py-2"
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 font-bold px-2"
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ key: '', value: '' })}
        className="text-sm text-indigo-600 font-medium hover:underline"
      >
        + Add Spec
      </button>
    </div>
  );
}
