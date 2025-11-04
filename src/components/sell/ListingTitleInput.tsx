import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function ListingTitleInput({
  register,
  error,
}: {
  register: UseFormRegister<ProductFormData>
  error?: FieldErrors['title']
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">Tiêu đề</label>
      <input
        {...register('title')}
        type="text"
        placeholder="Nhập tiêu đề sản phẩm"
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-sm text-red-500">{error.message as string}</p>}
    </div>
  )
}
