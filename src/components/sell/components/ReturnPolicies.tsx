import { useFormContext, Controller } from "react-hook-form";

export default function ReturnPolicies() {
  const { control } = useFormContext();

  const options = [
    "Không đổi trả",
    "Cho đổi trong 7 ngày",
    "Cho đổi trong 30 ngày",
  ];

  return (
    <div>
      <label className="block font-medium mb-1">Chính sách đổi trả</label>

      <Controller
        name="return_policy"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value ?? ""}        // ⬅️ FIX LỖI: ép null → ""
            onChange={(e) => field.onChange(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Chọn chính sách</option>

            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
