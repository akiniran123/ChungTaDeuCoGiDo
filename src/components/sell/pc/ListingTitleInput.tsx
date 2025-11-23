// components/sell/ListingTitleInput.tsx
"use client";
import { useFormContext } from "react-hook-form";

export default function ListingTitleInput({ error }: any) {
  const { register } = useFormContext();

  return (
    <div>
      <label className="block mb-1 font-medium">Tiêu đề sản phẩm</label>

      <input
        {...register("title", { required: true })}
        className="w-full border rounded p-2"
        placeholder="VD: Laptop gaming RTX 4060"
      />

      {error && (
        <p className="text-red-500 text-sm">Vui lòng nhập tiêu đề</p>
      )}
    </div>
  );
}
