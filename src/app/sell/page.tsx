'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SellPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState<File[]>([]);
  const [condition, setCondition] = useState('');

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert('You must be logged in to post.');
      setLoading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Upload failed:', uploadError.message);
        continue;
      }

      const publicUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
      uploadedUrls.push(publicUrl);
    }

    const { error } = await supabase.from('products').insert([
      {
        title,
        category,
        is_private: isPrivate,
        user_id: user.id,
        specs,
        images: uploadedUrls,
        condition,
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add a New Listing</h1>

      {/* Bank Account Info Banner */}
      <div className="flex items-start gap-4 bg-indigo-100 border border-indigo-300 p-4 rounded-md mb-6">
        <div className="text-2xl mt-1">💰</div>
        <div className="flex-1">
          <p className="font-semibold">Link your bank account to get paid (it only takes a few minutes!)</p>
          <p className="text-sm mt-1">
            You will be able to create draft listings, but must link your bank account to publish or be paid out. Jawa uses Stripe&apos;s platform to securely link to your bank account.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700">
          GET STARTED
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing Info */}
        <div className="border rounded-lg p-5 space-y-5">
          <h2 className="font-semibold text-lg">Listing information</h2>

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

          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">Private Listing</p>
              <p className="text-sm text-gray-500">
                Private listings will not appear in search results or on your seller page — they can only be accessed by a special link.
              </p>
            </div>
            <div className="relative">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition duration-300"></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isPrivate ? 'translate-x-5' : ''}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Tech Specs */}
        <div className="border rounded-lg p-5 space-y-5">
          <h2 className="font-semibold text-lg">Tech Specs</h2>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Key (e.g. CPU)"
                className="w-1/3 border rounded px-3 py-2"
                value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value (e.g. Intel i7)"
                className="w-2/3 border rounded px-3 py-2"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              />
              <button type="button" onClick={() => removeSpec(index)} className="text-red-500 font-bold px-2">×</button>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="text-sm text-indigo-600 font-medium hover:underline">+ Add Spec</button>
        </div>

        {/* Image Upload */}
        <div className="border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-lg">Images <span className="text-red-500">*</span></h2>
          <p className="text-sm text-gray-600">
            Upload up to 10 photos in JPG, PNG, GIF, or WEBP format. Each image under 1MB for faster upload.
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer hover:border-indigo-500">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-gray-500">Drag and drop photos, or <span className="underline text-indigo-600">click to upload</span>.</p>
          </label>
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                <img src={URL.createObjectURL(img)} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1"
                >✕</button>
              </div>
            ))}
          </div>
          <div className="bg-orange-100 border border-orange-300 p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">📸 Listings with quality photos sell 30% faster</p>
              <p className="text-xs text-gray-600">Head over to Seller Academy and learn how to take great photos</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-white bg-indigo-600 text-xs px-3 py-1 rounded hover:bg-indigo-700">PHOTO GUIDE</button>
              <button type="button" className="text-xs text-gray-500">DISMISS</button>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-lg">Description</h2>
          <div>
            <label className="block font-medium mb-1">Condition <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {['Brand New in Box', 'New Open Box', 'Used, Like New', 'Used, Good', 'Used, Fair', 'As-Is / For Parts'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={option}
                    checked={condition === option}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
