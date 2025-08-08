'use client';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

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

  const [previews, setPreviews] = useState<string[]>([]);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Quản lý tạo và hủy object URLs
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Hàm xử lý upload file (cả input lẫn drag-drop)
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setUploadError(null); // reset lỗi trước khi validate
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 1024 * 1024; // 1MB

    const validFiles = Array.from(files).filter((file) => {
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length === 0) {
      setUploadError('Please upload valid images (JPG, PNG, WEBP, GIF) under 1MB.');
      return;
    }

    const selected = validFiles.slice(0, 10); // giới hạn max 10 ảnh
    setValue('images', selected, { shouldValidate: true });
  };

  // Xử lý input change
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Xử lý drop file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // Xử lý keyboard cho vùng upload (Enter, Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className="border rounded-lg p-5 space-y-4">
      <label className="font-semibold text-lg block">
        Images <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-600">
        You can upload up to 10 photos in JPG, PNG, GIF, or WEBP format. For best results, use a 4:3 aspect ratio,
        size images to at least 1200px on the shortest side at 72 PPI, and keep each file under 1MB for quick uploads.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload images by clicking or drag and drop"
        className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p>
            Drag and drop photos, or <span className="underline">click to upload</span>.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Preview ảnh */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="border p-1 rounded">
              <img
                src={src}
                className="h-24 w-full object-cover rounded"
                alt={`Uploaded preview image ${idx + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Banner */}
      {bannerVisible && (
        <div className="bg-orange-50 border border-orange-300 text-sm p-3 rounded-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="camera" className="text-xl">
              📷
            </span>
            <p className="font-medium">
              Listings with quality photos sell 30% faster
              <br />
              <span className="text-xs text-gray-600">
                Head over to Seller Academy and learn how to take great photos
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full"
              onClick={() => window.open('https://selleracademy.example.com/photo-guide', '_blank')}
            >
              PHOTO GUIDE
            </button>
            <button
              type="button"
              className="text-sm border border-gray-400 text-gray-600 px-3 py-1 rounded-full"
              onClick={() => setBannerVisible(false)}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Lỗi upload riêng */}
      {(uploadError || error?.message) && (
        <p className="text-red-500 text-sm">{uploadError ?? error?.message}</p>
      )}
    </div>
  );
}
