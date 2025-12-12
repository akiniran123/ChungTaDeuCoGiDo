"use client";

import { useFormContext, Controller } from "react-hook-form";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImageFromUrl";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { FieldErrors } from "react-hook-form";

interface ImageUploaderProps {
  error?: FieldErrors | boolean | string;
}

function getErrorMessage(err?: FieldErrors | boolean | string) {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMessage = (err as { message?: unknown }).message;
    return typeof maybeMessage === "string" ? maybeMessage : "Ảnh là bắt buộc";
  }
  return "Ảnh là bắt buộc";
}

export default function ImageUploader({ error }: ImageUploaderProps) {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseClientOrNull();
    if (!supabase) {
      if (mounted) setUserId(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (data?.user) setUserId(data.user.id);
      } catch (err) {
        console.warn("Failed to get user:", err);
        if (mounted) setUserId(null);
      }
    };
    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      alert("⚠️ Vui lòng đợi hệ thống xác định tài khoản trước khi tải ảnh.");
      return;
    }

    // Revoke previous blob preview if any
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const supabase = getSupabaseClientOrNull();
    if (!supabase) {
      alert("Supabase chưa được cấu hình. Không thể tải ảnh.");
      return;
    }

    const fileName = `product-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = `user_${userId}/${fileName}`;

    try {
      // upload returns { data, error } in supabase client
      const uploadRes = await supabase.storage.from("images").upload(filePath, file, { upsert: true });
      if (uploadRes.error) {
        console.error("❌ Lỗi upload ảnh:", uploadRes.error.message);
        alert("Tải ảnh thất bại!");
        return;
      }

      // getPublicUrl does not return an error field; it returns { data: { publicUrl } }
      const publicUrlRes = supabase.storage.from("images").getPublicUrl(filePath);
      const publicUrl = publicUrlRes?.data?.publicUrl ?? null;

      if (!publicUrl) {
        console.warn("Không lấy được public URL, dùng preview tạm thời");
        onChange([previewUrl]);
        return;
      }

      setPreview(publicUrl);
      onChange([publicUrl]);
    } catch (err) {
      console.error("Unexpected upload error:", err);
      alert("Tải ảnh thất bại!");
    }
  };

  const handleLinkPaste = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string[]) => void
  ) => {
    const rawValue = e.target.value.trim();
    const cleanValue = rawValue.replace(/"/g, "");
    onChange([cleanValue]);
    setPreview(cleanValue);

    if (cleanValue.startsWith("http")) {
      const supabase = getSupabaseClientOrNull();
      if (!supabase || !userId) {
        // If no supabase or no user, just set preview and return
        return;
      }

      setLoading(true);
      try {
        const uploaded = await uploadImageFromUrl(cleanValue, userId);
        if (uploaded) {
          setPreview(uploaded);
          onChange([uploaded]);
        }
      } catch (err) {
        console.error("Error uploading image from URL:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Ảnh sản phẩm</label>

      <Controller
        name="images"
        control={control}
        render={({ field }) => {
          const currentValue =
            field.value && Array.isArray(field.value) ? field.value[0] : "";
          const previewSrc = ((preview || currentValue) || "").replace(/"/g, "");

          return (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Dán link ảnh hoặc chọn ảnh..."
                  value={currentValue || ""}
                  onChange={(e) => handleLinkPaste(e, field.onChange as (val: string[]) => void)}
                />

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
                    onChange={(e) => handleFileSelect(e, field.onChange as (val: string[]) => void)}
                  />
                </label>
              </div>

              {loading && (
                <p className="text-gray-500 text-sm">Đang tải ảnh từ URL...</p>
              )}

              {previewSrc ? (
                <div className="w-32 h-32 relative rounded border overflow-hidden">
                  <Image
                    src={previewSrc}
                    alt="Preview"
                    fill
                    sizes="128px"
                    className="object-cover"
                    onError={() => setPreview("/placeholder.png")}
                  />
                </div>
              ) : null}
            </div>
          );
        }}
      />

      {getErrorMessage(error) && (
        <p className="text-red-500 text-sm mt-1">
          {getErrorMessage(error)}
        </p>
      )}
    </div>
  );
}