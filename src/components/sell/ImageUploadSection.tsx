'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Control } from 'react-hook-form';

interface ImageUploaderSectionProps {
  setValue: (field: string, value: any, options?: object) => void;
  watch: (field: string) => File[];
  error?: any;
}

export default function ImageUploaderSection({ setValue, watch, error }: ImageUploaderSectionProps) {
  const [uploading, setUploading] = useState(false);
  const images = watch('images') || [];

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedFiles: File[] = [...images];
    for (const file of files) {
      // Tạo tên file unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        alert('Upload image failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      // Lấy public url
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        alert('Failed to get public URL for uploaded image.');
        setUploading(false);
        return;
      }

      // Mình đẩy url vào mảng images
      uploadedFiles.push(new File([file], publicUrlData.publicUrl));
    }

    setValue('images', uploadedFiles, { shouldValidate: true });
    setUploading(false);
  }

  function handleRemoveImage(index: number) {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldValidate: true });
  }

  return (
    <div className="space-y-2">
      <label className="block font-semibold">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block mb-2"
      />
      {error && <p className="text-red-600 text-sm">{error.message}</p>}

      <div className="flex flex-wrap gap-3">
        {images.map((img: any, idx: number) => {
          const src = img instanceof File ? URL.createObjectURL(img) : img;
          return (
            <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
              <img src={src} alt={`Uploaded ${idx}`} className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full w-6 h-6 text-white flex items-center justify-center text-sm"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
