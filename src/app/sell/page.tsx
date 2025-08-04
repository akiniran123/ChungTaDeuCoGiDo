'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase/client';

import BankAccountBanner from '@/components/sell/BankAccountBanner';
import CategorySelect from '@/components/sell/CategorySelect';
import ListingTitleInput from '@/components/sell/ListingTitleInput';
import PrivateToggle from '@/components/sell/PrivateToggle';
import TechSpecsEditor from '@/components/sell/TechSpecsEditor';
import ImageUploader from '@/components/sell/ImageUploader';
import ConditionSelector from '@/components/sell/ConditionSelector';
import DescriptionEditor from '@/components/sell/DescriptionEditor';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  category: z.string().min(1, 'Category is required'),
  isPrivate: z.boolean(),
  condition: z.enum([
    'brand_new',
    'new_open_box',
    'used_like_new',
    'used_good',
    'as_is',
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specs: z.array(
    z.object({
      key: z.string().min(1, 'Spec key is required'),
      value: z.string().min(1, 'Spec value is required'),
    })
  ),
  images: z.array(z.instanceof(File)).max(10, 'You can upload up to 10 images'),
});

export type ProductFormData = z.infer<typeof schema>;

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      isPrivate: false,
      condition: 'brand_new',
      description: '',
      specs: [{ key: '', value: '' }],
      images: [],
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to post.');
      setLoading(false);
      return;
    }

    const uploadedImageUrls: string[] = [];

    for (const file of data.images) {
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        alert('Image upload failed');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        alert('Failed to get public image URL');
        setLoading(false);
        return;
      }

      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    const { error: insertError } = await supabase.from('products').insert([
      {
        user_id: user.id,
        title: data.title,
        category: data.category,
        is_private: data.isPrivate,
        specs: data.specs,
        description: data.description,
        condition: data.condition,
        images: uploadedImageUrls,
      },
    ]);

    setLoading(false);

    if (insertError) {
      alert('Error submitting listing');
      console.error(insertError.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add a New Listing</h1>

      <BankAccountBanner />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-5 space-y-6">
          <h2 className="font-semibold text-lg">Listing information</h2>
          <CategorySelect register={register} error={errors.category} />
          <ListingTitleInput register={register} error={errors.title} />
          <PrivateToggle register={register} />
        </div>

        <TechSpecsEditor control={control} />
        <ImageUploader setValue={setValue} watch={watch} error={errors.images} />
        <ConditionSelector register={register} />
        <DescriptionEditor control={control} error={errors.description} />

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
