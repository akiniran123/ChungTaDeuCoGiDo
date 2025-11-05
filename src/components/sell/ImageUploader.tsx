"use client";

import { useFormContext, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImageFromUrl";
import { useState } from "react";

export default function ImageUploader({ error }: any) {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Upload ảnh từ máy lên Supabase
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const fileName = `product-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) {
      console.error("❌ Lỗi upload ảnh:", error.message);
      alert("Tải ảnh thất bại!");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;
    setPreview(publicUrl);
    onChange([publicUrl]);
  };

  // ✅ Khi người dùng dán link ảnh
  const handleLinkPaste = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void
  ) => {
    const rawValue = e.target.value.trim();
    const cleanValue = rawValue.replace(/"/g, "");
    onChange([cleanValue]);
    setPreview(cleanValue);

    if (cleanValue.startsWith("http")) {
      const uploaded = await uploadImageFromUrl(cleanValue);
      if (uploaded) {
        setPreview(uploaded);
        onChange([uploaded]);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Ảnh sản phẩm</label>

      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border rounded p-2"
                placeholder="Dán link ảnh hoặc chọn ảnh..."
                value={field.value?.[0] || ""}
                onChange={(e) => handleLinkPaste(e, field.onChange)}
              />

              <label className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, field.onChange)}
                />
              </label>
            </div>

            {(preview || field.value?.[0]) && (
              <img
                src={(preview || field.value[0]).replace(/"/g, "")}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/placeholder.png")
                }
              />
            )}
          </div>
        )}
      />

      {error && <p className="text-red-500 text-sm mt-1">Ảnh là bắt buộc</p>}
    </div>
  );
}
