import { UseFormRegister } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function ProductVideoInput({
  register,
  error,
}: {
  register: UseFormRegister<ProductFormData>
  error?: any
}) {
  return (
    <div className="space-y-1">
      <label className="font-medium">Video (URL)</label>
      <input
        {...register('videoUrl')}
        className="w-full border rounded px-3 py-2"
        placeholder="https://..."
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
