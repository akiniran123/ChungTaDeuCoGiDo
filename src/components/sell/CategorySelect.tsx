import { UseFormRegister } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
  error?: { message?: string };
};

export default function CategorySelect({ register, error }: Props) {
  return (
    <div>
      <label className="block font-medium mb-1">
        Category <span className="text-red-500">*</span>
      </label>
      <select
        {...register('category')}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select category</option>
        <option value="gaming_pc">Gaming PC</option>
        <option value="gpu">GPU</option>
        <option value="cpu">CPU</option>
        <option value="peripheral">Peripheral</option>
        <option value="other">Other</option>
      </select>
      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
