'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export default function SellPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [form, setForm] = useState({
    title: '',
    desc: '',
    price: '',
    category: '',
    files: [] as File[],
  });

  useEffect(() => {
    const auth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/');
      setUser(user);
      setLoadingUser(false);
    };
    auth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 1. Upload images
    const uploadedUrls: string[] = [];
    for (const file of form.files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('listings') // Ensure you created this bucket in Supabase
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        return alert('Failed to upload image.');
      }

      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    // ✅ 2. Insert metadata into database
    const { error: insertError } = await supabase
      .from('listings')
      .insert([
        {
          title: form.title,
          desc: form.desc,
          price: parseFloat(form.price),
          category: form.category,
          images: uploadedUrls,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('Failed to save listing.');
    }

    alert('Listing created!');
    router.push('/'); // or redirect to `/my-listings`
  };

  if (loadingUser) return <p className="p-10">Checking auth...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Start Selling</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="gpu">GPU</option>
          <option value="pc">PC</option>
          <option value="peripheral">Peripheral</option>
        </select>

        {/* Title */}
        <input
          type="text"
          placeholder="Listing Name (min 5 words)"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          rows={6}
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          multiple
          onChange={(e) =>
            setForm((f) => ({ ...f, files: Array.from(e.target.files || []) }))
          }
          accept="image/png, image/jpeg, image/webp"
          className="w-full"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price (USD)"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}
