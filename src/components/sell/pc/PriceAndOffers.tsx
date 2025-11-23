import { useFormContext, Controller } from "react-hook-form";

export default function PriceAndOffers() {
  const { control, watch } = useFormContext(); // ✅ lấy từ FormProvider

  return (
    <div>
      <label className="block font-medium mb-1">Giá (VNĐ)</label>

      <Controller
        name="price"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            className="w-full border rounded p-2"
            placeholder="VD: 15000000"
          />
        )}
      />

      {watch("price") && (
        <p className="text-sm text-gray-600 mt-1">Cho thương lượng?</p>
      )}
    </div>
  );
}
