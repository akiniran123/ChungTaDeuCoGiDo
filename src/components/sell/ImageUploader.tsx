'use client';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';
import { ChangeEvent, useRef } from 'react';

type Props = {
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  error?: {
    message?: string;
  };
};

export default function ImageUploader({ setValue, watch, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = watch('images') || [];

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const validFiles = Array.from(files).filter(file => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 1024 * 1024; // 1MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  });

  if (validFiles.length === 0) {
    alert('Please upload valid images (JPG, PNG, WEBP, GIF) under 1MB.');
    return;
  }

  const selected = validFiles.slice(0, 10); // Limit max 10 images
  setValue('images', selected, { shouldValidate: true });
};


  return (
    <div className="border rounded-lg p-5 space-y-4">
      <label className="font-semibold text-lg block">Images <span className="text-red-500">*</span></label>
      <p className="text-sm text-gray-600">
        You can upload up to 10 photos in JPG, PNG, GIF, or WEBP format. For best results, use a 4:3 aspect ratio,
        size images to at least 1200px on the shortest side at 72 PPI, and keep each file under 1MB for quick uploads.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition"
      >
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p>Drag and drop photos, or <span className="underline">click to upload</span>.</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((file, idx) => (
            <div key={idx} className="border p-1 rounded">
              <img src={URL.createObjectURL(file)} className="h-24 w-full object-cover rounded" alt={`preview-${idx}`} />
            </div>
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="bg-orange-50 border border-orange-300 text-sm p-3 rounded-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="camera" className="text-xl">📷</span>
          <p className="font-medium">
            Listings with quality photos sell 30% faster
            <br />
            <span className="text-xs text-gray-600">Head over to Seller Academy and learn how to take great photos</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full">PHOTO GUIDE</button>
          <button type="button" className="text-sm border border-gray-400 text-gray-600 px-3 py-1 rounded-full">DISMISS</button>
        </div>
      </div>

      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
