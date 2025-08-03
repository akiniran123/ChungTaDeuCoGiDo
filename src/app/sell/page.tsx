// src/app/sell/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SellPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
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
        category,
        is_private: isPrivate,
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add a New Listing</h1>

      {/* Bank Account Banner */}
      <div className="bg-indigo-100 border border-indigo-300 p-4 rounded-md flex items-start gap-4 mb-6">
        <div className="text-2xl">💰</div>
        <div className="flex-1">
          <p className="font-semibold">
            Link your bank account to get paid (it only takes a few minutes!)
          </p>
          <p className="text-sm mt-1">
            You must link your bank account to publish or get paid out. Jawa uses Stripe's platform to
            securely link your account.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700">
          GET STARTED
        </button>
      </div>

      {/* Listing Information */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-5">
          <h2 className="font-semibold text-lg mb-4">Listing information</h2>

          <div className="space-y-4">
            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Category <span className="text-red-500">*</span></label>
              <select
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="gaming_pc">Gaming PC</option>
                <option value="gpu">GPU</option>
                <option value="cpu">CPU</option>
                <option value="peripheral">Peripheral</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Listing Title */}
            <div>
              <label className="block font-medium mb-1">Listing name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Example: On Sale! BNIB Intel Core i9-9900k LGA1151 8 Core Processor!"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <div className="text-sm text-gray-500 mt-1">{title.length}/100</div>
            </div>

            {/* Private Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Private Listing</p>
                <p className="text-sm text-gray-500">
                  Private listings will not appear in search results or on your seller page — they can only be
                  accessed by a special link.
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition"></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                    isPrivate ? 'translate-x-5' : ''
                  }`}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
