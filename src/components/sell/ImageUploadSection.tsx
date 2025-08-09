'use client';

import React, { useState } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';

interface ProductFormData {
  images: File[];
  // các field khác bạn có thể thêm ở đây
}

interface ImageUploaderSectionProps {
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  error?: { message?: string };
}

export function ImageUploaderSection({ setValue, watch, error }: ImageUploaderSectionProps) {
  const [uploading, setUploading] = useState(false);
  const images = watch('images') ?? ([] as File[]);

  // Tạo preview URL
  const previews = images.map((file) => URL.createObjectURL(file));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 1024 * 1024; // 1MB

    const validFiles = Array.from(files).filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );

    if (validFiles.length === 0) {
      alert('Please upload valid images (JPG, PNG, WEBP, GIF) under 1MB.');
      return;
    }

    const newImages = [...images, ...validFiles].slice(0, 10);
    setValue('images', newImages, { shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <label className="block font-semibold">
        Upload Images <span className="text-red-500">*</span>
      </label>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="block"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative w-full h-24 border rounded overflow-hidden">
              <img
                src={src}
                alt={`Preview ${idx + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full w-6 h-6 text-white flex items-center justify-center text-sm"
                aria-label={`Remove image ${idx + 1}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {error?.message && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}

// Hàm upload 1 file lên Supabase Storage, trả về URL public hoặc null nếu lỗi
async function uploadFileToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    console.error('Failed to get public URL');
    return null;
  }

  return publicUrlData.publicUrl;
}

// Demo 1 form ví dụ dùng react-hook-form, gọi upload khi submit
export default function DemoUploadForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: { images: [] },
  });

  const [submitting, setSubmitting] = useState(false);

  // Xử lý submit form
  const onSubmit = async (data: ProductFormData) => {
    if (!data.images || data.images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setSubmitting(true);

    const uploadedUrls: string[] = [];

    for (const file of data.images) {
      const url = await uploadFileToSupabase(file);
      if (!url) {
        alert('Upload failed for some files. Please try again.');
        setSubmitting(false);
        return;
      }
      uploadedUrls.push(url);
    }

    setSubmitting(false);

    console.log('Uploaded image URLs:', uploadedUrls);
    alert('Upload successful! Check console for URLs.');

    // TODO: Lưu uploadedUrls vào database hoặc gửi server ở đây
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-4">
      <ImageUploaderSection setValue={setValue} watch={watch} error={errors.images} />

      <button
        type="submit"
        disabled={submitting}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}
