import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function ReturnPolicies({
  register,
  error,
}: {
  register: UseFormRegister<ProductFormData>
  error?: FieldErrors['returnPolicy']
}) {
  const returnOptions = [
    { label: 'Không trả hàng', value: 'no_returns' },
    { label: 'Trả trong 7 ngày', value: '7_days' },
    { label: 'Trả trong 14 ngày', value: '14_days' },
  ]

  return (
    <div className="space-y-1">
      <label className="font-medium">Chính sách trả hàng</label>
      <select {...register('returnPolicy')} className="w-full border rounded px-3 py-2">
        <option value="">Không chọn</option>
        {returnOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error.message as string}</p>}
    </div>
  )
}