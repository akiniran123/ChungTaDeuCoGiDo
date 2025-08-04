import { UseFormRegister } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  register: UseFormRegister<ProductFormData>;
};

export default function ConditionSelector({ register }: Props) {
  return (
    <div className="space-y-3">
      <label className="font-semibold text-lg block">Condition <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" value="brand_new" {...register('condition')} />
          Brand New in Box
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" value="new_open_box" {...register('condition')} />
          New Open Box
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" value="used_like_new" {...register('condition')} />
          Used, Like New
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" value="used_good" {...register('condition')} />
          Used, Good
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" value="as_is" {...register('condition')} />
          As-Is / For Parts
        </label>
      </div>
    </div>
  );
}
