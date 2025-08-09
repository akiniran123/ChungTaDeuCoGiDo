'use client';

import { supabase } from '@/lib/supabase/client';
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

  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Tạo và hủy object URLs để preview ảnh upload
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Hàm upload 1 file lên Supabase, trả về publicUrl hoặc null nếu lỗi
  async function uploadFile(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images') // Bucket name
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return null;
    }

    // getPublicUrl không trả về error, chỉ trả về data
    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      console.error('Failed to get public URL');
      return null;
    }

    return publicData.publicUrl;
  }

  // Xử lý upload nhiều file: upload từng file, lấy URL rồi tạo File fake để preview + lưu vào form
  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setUploading(true);

    // Giữ lại những ảnh đã có trong form (File[])
    const currentFiles = [...images];
    // Mảng chứa file mới tạo sau khi upload để preview + setValue
    const newFiles: File[] = [];

    for (const file of Array.from(files)) {
      // Check loại file và kích thước (1MB)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only JPG, PNG, WEBP, GIF files are allowed.');
        setUploading(false);
        return;
      }
      if (file.size > 1024 * 1024) {
        setUploadError('Each file must be under 1MB.');
        setUploading(false);
        return;
      }

      const publicUrl = await uploadFile(file);

      if (!publicUrl) {
        setUploadError('Failed to upload one or more images.');
        setUploading(false);
        return;
      }

      // Tạo file fake dùng để preview bằng cách dùng Blob chứa URL string
      // Vì file object cần giữ type File để preview
      const fakeFile = new File([file], file.name, { type: file.type });
      // Mình không thể set trực tiếp URL vào File, nên lưu File thật và để preview qua URL tạo từ file thật
      newFiles.push(fakeFile);
    }

    // Giới hạn tổng ảnh max 10
    const combinedFiles = [...currentFiles, ...newFiles].slice(0, 10);

    setValue('images', combinedFiles, { shouldValidate: true });
    setUploading(false);
  }

  function handleRemoveImage(index: number) {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldValidate: true });
  }

  // Kích hoạt input file khi click div
  const openFileDialog = () => {
    inputRef.current?.click();
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
        onClick={openFileDialog}
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
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Preview */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="border p-1 rounded relative">
              <img src={src} className="h-24 w-full object-cover rounded" alt={`Uploaded preview ${idx + 1}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full w-6 h-6 text-white flex items-center justify-center text-sm"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}

      {uploading && <p>Uploading...</p>}
    </div>
  );
}
