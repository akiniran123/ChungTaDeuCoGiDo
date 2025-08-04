'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase/client';
import { productSchema, ProductFormData } from '@/types/form';

import BankAccountBanner from '@/components/sell/BankAccountBanner';
import CategorySelect from '@/components/sell/CategorySelect';
import ListingTitleInput from '@/components/sell/ListingTitleInput';
import PrivateToggle from '@/components/sell/PrivateToggle';
import TechSpecsEditor from '@/components/sell/TechSpecsEditor';
import ImageUploaderSection from '@/components/sell/ImageUploader';
import ConditionSelectorSection from '@/components/sell/ConditionSelector';
import DescriptionEditorSection from '@/components/sell/DescriptionEditor';
import ReturnPolicies from '@/components/sell/ReturnPolicies';
import ActionButtons from '@/components/sell/ActionButtons';

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
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      category: '',
      isPrivate: false,
      condition: 'brand_new',
      description: '',
      specs: [{ key: '', value: '' }],
      images: [],
      videoUrl: '',
      price: 0,
      enableOffers: false,
      minOffer: 0,
      quantity: 1,
      sku: '',
      returnPolicy: '',
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
        condition: data.condition,
        description: data.description,
        specs: data.specs,
        images: uploadedImageUrls,
        video_url: data.videoUrl,
        price: data.price,
        enable_offers: data.enableOffers,
        min_offer: data.minOffer,
        quantity: data.quantity,
        sku: data.sku,
        return_policy: data.returnPolicy,
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
        {/* Section: Basic Info */}
        <div className="border rounded-lg p-5 space-y-6">
          <h2 className="font-semibold text-lg">Listing Information</h2>
          <CategorySelect register={register} error={errors.category} />
          <ListingTitleInput register={register} error={errors.title} />
          <PrivateToggle register={register} />
        </div>

        {/* Section: Tech Specs */}
        <TechSpecsEditor control={control} />

        {/* Section: Images */}
        <ImageUploaderSection setValue={setValue} watch={watch} error={errors.images} />

        {/* Section: Condition */}
        <ConditionSelectorSection register={register} />

        {/* Section: Description */}
        <DescriptionEditorSection control={control} error={errors.description} />

        {/* Section: Return Policy */}
        <ReturnPolicies register={register} error={errors.returnPolicy} />

        {/* Submit */}
        <ActionButtons loading={loading} />
      </form>
    </div>
  );
}
