'use client'

import { useState, ChangeEvent } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'

interface ImageUploaderProps {
  bucket?: string
  onUploadComplete?: (url: string) => void
}

export default function ImageUploader({
  bucket = 'product-images',
  onUploadComplete,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)

      // Tạo tên file duy nhất
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      // Upload file
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) {
        throw error
      }

      // Lấy public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl)
        if (onUploadComplete) onUploadComplete(data.publicUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100
        "
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Uploaded preview"
          width={200}
          height={200}
          className="rounded-lg border"
        />
      )}
    </div>
  )
}
