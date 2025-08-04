'use client';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  error?: {
    message?: string;
  };
};

export default function ImageUploader({ setValue, watch, error }: Props) {
  const images = watch('images');

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 10); // Max 10
    setValue('images', fileArray, { shouldValidate: true });
  };

  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h2 className="font-semibold text-lg">Photos</h2>
      <p className="text-sm text-gray-500">Upload up to 10 images</p>

      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error?.message && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}

      {images?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {images.map((file, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded border">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
