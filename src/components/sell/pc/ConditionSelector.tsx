import { useFormContext, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

interface ConditionSelectorProps {
  error?: boolean | string;
}

export default function ConditionSelector({ error }: ConditionSelectorProps) {
  const { control } = useFormContext<FieldValues>(); // Lấy control từ context

  const conditions = [
    { value: "brand_new", label: "Mới 100%" },
    { value: "new_open_box", label: "Mở hộp như mới" },
    { value: "used_good", label: "Đã dùng - Tốt" },
    { value: "as_is", label: "Thanh lý - Không bảo hành" },
  ];

  return (
    <div>
      <label className="block mb-1 font-medium">Tình trạng</label>

      <Controller
        name="condition"
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full border rounded p-2">
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        )}
      />

      {error && <p className="text-red-500 text-sm">Chọn tình trạng</p>}
    </div>
  );
}