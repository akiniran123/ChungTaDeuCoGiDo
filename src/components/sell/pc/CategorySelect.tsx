// components/sell/CategorySelect.tsx
"use client";
import { Controller, useFormContext } from "react-hook-form";

const categories = [
  "Điện thoại",
  "Laptop",
  "PC / Màn hình",
  "Phụ kiện",
  "Khác"
];

export default function CategorySelect({ error }: any) {
  const { control } = useFormContext();

  return (
    <div>
      <label className="block mb-1 font-medium">Danh mục</label>

      <Controller
        name="category"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <select {...field} className="w-full border rounded p-2">
            <option value="">Chọn danh mục</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      />

      {error && <p className="text-red-500 text-sm">Chọn danh mục</p>}
    </div>
  );
}
