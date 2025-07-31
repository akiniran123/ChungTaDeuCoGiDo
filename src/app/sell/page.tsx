'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export default function SellPage() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
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
      const { data, error } = await supabase.auth.getUser();

      if (!data?.user) {
        router.push('/');
        return;
      }

      setUser(data.user);
      setLoadingUser(false);
    };

    auth();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadedUrls: string[] = [];

    for (const file of form.files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload image.');
        return;
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
      alert('Failed to save listing.');
      return;
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
          onChange={(e) =>
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
          onChange={(e) =>
            setForm((f) => ({ ...f, title: e.target.value }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) =>
            setForm((f) => ({ ...f, desc: e.target.value }))
          }
          rows={6}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="file"
          multiple
          onChange={(e) =>
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
          onChange={(e) =>
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
