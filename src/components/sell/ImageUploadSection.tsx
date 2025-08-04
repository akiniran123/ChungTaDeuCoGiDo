'use client';

import { useDropzone } from 'react-dropzone';
import { ImageIcon, InfoIcon } from 'lucide-react';
import { useCallback } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  error?: { message?: string };
};

export default function ImageUploaderSection({ setValue, watch, error }: Props) {
  const images = watch('images');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const current = images || [];
      if (current.length + acceptedFiles.length > 10) return;

      setValue('images', [...current, ...acceptedFiles], {
        shouldValidate: true,
      });
    },
    [images, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    multiple: true,
    maxSize: 1024 * 1024,
  });

  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h2 className="font-semibold text-lg">Images <span className="text-red-500">*</span></h2>
      <p className="text-sm text-gray-600">
        You can upload up to 10 photos in JPG, PNG, GIF, or WEBP format. For best results, use a 4:3 aspect ratio, size images to at least 1200px on the shortest side at 72 PPI, and keep each file under 1MB for quick uploads.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <ImageIcon className="w-8 h-8" />
          <p>
            Drag and drop photos, or{' '}
            <span className="text-indigo-600 underline">click to upload</span>.
          </p>
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}

      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {images.map((file, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="object-cover rounded-md w-full h-32 border"
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-orange-50 border border-orange-300 text-orange-800 rounded-md px-4 py-3 text-sm flex items-start gap-2">
        <ImageIcon className="w-5 h-5 mt-1" />
        <div>
          <p className="font-semibold">
            Listings with quality photos sell 30% faster
          </p>
          <p className="mt-1">
            Head over to Seller Academy and learn how to take great photos
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="text-sm font-medium text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700">
            PHOTO GUIDE
          </button>
          <button className="text-sm text-gray-600 hover:underline">DISMISS</button>
        </div>
      </div>
    </div>
  );
}
