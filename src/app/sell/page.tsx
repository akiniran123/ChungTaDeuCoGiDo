'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@supabase/supabase-js';

export default function SellPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState<{
    title: string;
    desc: string;
    price: string;
    category: string;
    files: File[];
  }>({
    title: '',
    desc: '',
    price: '',
    category: '',
    files: [],
  });

  useEffect(() => {
    const auth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push('/');
      setUser(user);
      setLoadingUser(false);
    };
    auth();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadedUrls: string[] = [];

    for (const file of form.files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('listings')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        return alert('Failed to upload image.');
      }

    const { data: publicUrlData } = supabase.storage
  .from('listings')
  .getPublicUrl(fileName);

if (publicUrlData?.publicUrl) {
  uploadedUrls.push(publicUrlData.publicUrl);
}


    }

    const { error: insertError } = await supabase.from('listings').insert([
      {
        title: form.title,
        desc: form.desc,
        price: parseFloat(form.price),
        category: form.category,
        images: uploadedUrls,
        user_id: user?.id,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return alert('Failed to save listing.');
    }

    alert('Listing created!');
    router.push('/');
  };

  if (loadingUser) return <p className="p-10">Checking auth...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Start Selling</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          value={form.category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setForm((f) => ({ ...f, category: e.target.value }))
          }
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="gpu">GPU</option>
          <option value="pc">PC</option>
          <option value="peripheral">Peripheral</option>
        </select>

        <input
          type="text"
          placeholder="Listing Name (min 5 words)"
          value={form.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, title: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, desc: e.target.value }))
          }
          rows={6}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="file"
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({
              ...f,
              files: Array.from(e.target.files || []),
            }))
          }
          accept="image/png, image/jpeg, image/webp"
          className="w-full"
        />

        <input
          type="number"
          placeholder="Price (USD)"
          value={form.price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, price: e.target.value }))
          }
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
