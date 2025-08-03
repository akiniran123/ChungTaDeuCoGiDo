'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SellPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert('You must be logged in to post.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('products').insert([
      {
        title,
        description,
        price: parseFloat(price),
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Error submitting listing');
      console.error(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Start Selling</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}