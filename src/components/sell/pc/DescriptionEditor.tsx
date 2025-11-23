import { Control, Controller, FieldErrors } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function DescriptionEditorSection({
  control,
  error,
}: {
  control: Control<ProductFormData>
  error?: FieldErrors['description']
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">Mô tả sản phẩm</label>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Nhập mô tả sản phẩm"
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message as string}</p>}
    </div>
  )
}
