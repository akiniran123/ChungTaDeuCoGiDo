import { Control, useFieldArray, Controller } from 'react-hook-form'
import { ProductFormData } from '@/types/form'

export default function TechSpecsEditor({
  control,
}: {
  control: Control<ProductFormData>
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specs',
  })

  return (
    <div className="space-y-2">
      <label className="font-medium">Thông số kỹ thuật</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex space-x-2">
          <Controller
            control={control}
            name={`specs.${index}.key`}
            render={({ field }) => (
              <input {...field} placeholder="Tên" className="border rounded px-2 py-1 flex-1" />
            )}
          />

          <Controller
            control={control}
            name={`specs.${index}.value`}
            render={({ field }) => (
              <input {...field} placeholder="Giá trị" className="border rounded px-2 py-1 flex-1" />
            )}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 cursor-pointer"
          >
            X
          </button>
        </div>
      ))}

      {/* Nút thêm thông số đã thêm cursor-pointer */}
      <button
        type="button"
        onClick={() => append({ key: '', value: '' })}
        className="text-blue-600 cursor-pointer"
      >
        + Thêm thông số
      </button>
    </div>
  )
}
