'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SellPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [] as File[],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of formData.images) {
        const filePath = `products/${Date.now()}-${file.name}`
        const uploadRes = await supabase.storage
          .from('images')
          .upload(filePath, file)

        if (uploadRes.error) {
          throw new Error(`Upload failed: ${uploadRes.error.message}`)
        }

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(uploadRes.data.path)

        uploadedUrls.push(data.publicUrl)
      }

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('Authentication required.')
      }

      const { error: insertError } = await supabase.from('products').insert([
        {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          image_urls: uploadedUrls,
          user_id: userData.user.id,
        },
      ])

      if (insertError) {
        throw new Error(insertError.message)
      }

      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Sell a Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
