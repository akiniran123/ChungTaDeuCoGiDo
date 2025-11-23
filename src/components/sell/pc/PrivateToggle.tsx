import { useFormContext, Controller } from "react-hook-form";

export default function PrivateToggle() {
  const { control } = useFormContext(); // ✅ Lấy control từ FormProvider

  return (
    <label className="flex items-center gap-2">
      <Controller
        name="is_private"
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)} // ✅ đảm bảo trả về boolean
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        )}
      />
      <span>Chỉ người mua thấy</span>
    </label>
  );
}
