import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

// ✅ Export Props để dùng ngoài
export interface CategorySelectProps {
  register: UseFormRegister<ProductFormData>
  error?: FieldErrors['category']
}

export default function CategorySelect({ register, error }: CategorySelectProps) {
  return (
    <div className="space-y-1">
      <label className="font-medium">Danh mục</label>
      <select {...register('category')} className="w-full border rounded px-3 py-2">
        <option value="">Chọn danh mục</option>
        <option value="pc">PC</option>
        <option value="phone">Điện thoại</option>
        <option value="laptop">Laptop</option>
      </select>
      {error && <p className="text-sm text-red-500">{error.message as string}</p>}
    </div>
  )
}
