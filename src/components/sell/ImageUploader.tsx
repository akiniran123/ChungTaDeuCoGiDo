'use client';

import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  error?: { message?: string };
};

export default function ImageUploader({ setValue, watch, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = watch('images') ?? ([] as File[]);

  // Mảng preview URL từ File
  const [previews, setPreviews] = useState<string[]>([]);

  // Tạo và hủy object URL để tránh memory leak
  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Xử lý khi chọn file
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 1024 * 1024; // 1MB

    const validFiles = Array.from(files).filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );

    if (validFiles.length === 0) {
      alert('Please upload valid images (JPG, PNG, WEBP, GIF) under 1MB.');
      return;
    }

    // Giới hạn tối đa 10 ảnh
    const newImages = [...images, ...validFiles].slice(0, 10);
    setValue('images', newImages, { shouldValidate: true });
  };

  // Xóa ảnh theo index
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <label className="block font-semibold">Upload Images <span className="text-red-500">*</span></label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        ref={inputRef}
        onChange={handleUpload}
        className="block"
      />

      {/* Preview ảnh */}
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
