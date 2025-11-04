import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function ConditionSelectorSection({
  register,
  error,
}: {
  register: UseFormRegister<ProductFormData>
  error?: FieldErrors['condition']
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">Tình trạng sản phẩm</label>
      <select {...register('condition')} className="w-full border rounded px-3 py-2">
        <option value="brand_new">Mới nguyên seal</option>
        <option value="new_open_box">Mới mở hộp</option>
        <option value="used_like_new">Cũ gần như mới</option>
        <option value="used_good">Cũ tốt</option>
        <option value="as_is">Cũ</option>
      </select>
      {error && <p className="text-sm text-red-500">{error.message as string}</p>}
    </div>
  )
}
