'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
}

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    // Tạo tên file duy nhất
    const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`

    try {
      // Upload file vào bucket 'images'
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Lấy URL public
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      if (!data?.publicUrl) throw new Error('Không lấy được URL public')

      onChange(data.publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload lỗi, vui lòng thử lại hoặc dán link trực tiếp')
    } finally {
      setUploading(false)
    }
  }

  const handleManualUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <label className="font-medium">Ảnh sản phẩm</label>

      {/* Upload file */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block"
      />

      {/* Dán URL trực tiếp */}
      <input
        type="text"
        placeholder="Dán URL ảnh"
        className="w-full border rounded px-3 py-2"
        value={value ?? ''}
        onChange={handleManualUrl}
      />

      {/* Preview */}
      {value && (
        <img
          src={value}
          alt="Preview"
          className="w-32 h-32 object-cover border rounded mt-2"
        />
      )}

      {/* Trạng thái */}
      {uploading && <p className="text-blue-600 text-sm">Đang tải ảnh...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}