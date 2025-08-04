import type { UseFormRegister } from 'react-hook-form';
import type { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
  error?: {
    message?: string;
  };
};

export default function ListingTitleInput({ register, error }: Props) {
  return (
    <div>
      <label className="block font-medium mb-1">
        Listing name <span className="text-red-500">*</span>
      </label>
      <input
        {...register('title')}
        placeholder="Example: On Sale! BNIB Intel Core i9-9900k LGA1151 8 Core Processor!"
        className="w-full border rounded px-3 py-2"
        maxLength={100}
      />
      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
