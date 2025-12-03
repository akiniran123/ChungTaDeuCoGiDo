"use client";

import { useFormContext, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImageFromUrl";
import { useState, useEffect } from "react";

export default function ImageUploader({ error }: any) {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  // ✅ Dọn URL blob khi component unmount
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✅ Upload ảnh từ máy
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId) {
      alert("⚠️ Vui lòng đợi hệ thống xác định tài khoản trước khi tải ảnh.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const fileName = `product-${Date.now()}-${file.name}`;
    const filePath = `user_${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("❌ Lỗi upload ảnh:", error.message);
      alert("Tải ảnh thất bại!");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    setPreview(publicUrl);
    onChange([publicUrl]);
  };

  // ✅ Upload từ link ảnh
  const handleLinkPaste = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void
  ) => {
    const rawValue = e.target.value.trim();
    const cleanValue = rawValue.replace(/"/g, "");
    onChange([cleanValue]);
    setPreview(cleanValue);

    if (cleanValue.startsWith("http") && userId) {
      setLoading(true);
      const uploaded = await uploadImageFromUrl(cleanValue, userId);
      setLoading(false);
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

              {/* ⭐ Nút chọn ảnh trung tính (không màu, hover hơi tối) */}
              <label
                className={`px-3 py-2 rounded border cursor-pointer transition duration-150
                ${
                  userId
                    ? "bg-transparent hover:bg-gray-100 active:bg-gray-200"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                {userId ? "Chọn ảnh" : "Đang tải user..."}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!userId}
                  onChange={(e) => handleFileSelect(e, field.onChange)}
                />
              </label>
            </div>

            {loading && (
              <p className="text-gray-500 text-sm">Đang tải ảnh từ URL...</p>
            )}

            {(preview || field.value?.[0]) && (
              <img
                src={(preview || field.value[0]).replace(/"/g, "")}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
                loading="lazy"
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
