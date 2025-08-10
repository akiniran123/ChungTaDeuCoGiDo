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
import ConditionSelectorSection from '@/components/sell/ConditionSelector';
import DescriptionEditorSection from '@/components/sell/DescriptionEditor';
import ProductVideoInput from '@/components/sell/ProductVideoInput';
import { PriceAndOffers } from '@/components/sell/PriceAndOffers';
import ReturnPolicies from '@/components/sell/ReturnPolicies';
import ActionButtons from '@/components/sell/ActionButtons';
import ImageUploader from '@/components/sell/ImageUploader'; // mới thêm

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
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
      videoUrl: '',
      price: 0,
      enableOffers: false,
      minOffer: 0,
      quantity: 1,
      sku: '',
      returnPolicy: undefined,
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setLoading(true);

    const safe = productSchema.safeParse(data);
    if (!safe.success) {
      alert('Validation failed — check console for details.');
      console.error(safe.error.format());
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('You must be logged in to post.');
        return;
      }

      const payload = {
        user_id: user.id,
        title: data.title,
        category: data.category,
        is_private: data.isPrivate,
        condition: data.condition,
        description: data.description,
        specs: data.specs,
        video_url: data.videoUrl || null,
        image_url: imageUrl, // thêm ảnh vào payload
        price: data.price,
        enable_offers: data.enableOffers,
        min_offer: data.minOffer,
        quantity: data.quantity,
        sku: data.sku || null,
        return_policy: data.returnPolicy || null,
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) {
        alert(`Insert error: ${insertError.message}`);
        return;
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Unexpected error, check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add a New Listing</h1>
      <BankAccountBanner />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-5 space-y-6">
          <h2 className="font-semibold text-lg">Listing Information</h2>
          <CategorySelect register={register} error={errors.category} />
          <ListingTitleInput register={register} error={errors.title} />
          <PrivateToggle register={register} />

          {/* Upload ảnh */}
          <ImageUploader onUploadComplete={(url) => setImageUrl(url)} />
          {imageUrl && (
            <p className="text-sm text-green-600">Image uploaded successfully!</p>
          )}
        </div>

        <TechSpecsEditor control={control} />
        <ConditionSelectorSection register={register} />
        <DescriptionEditorSection control={control} error={errors.description} />
        <ProductVideoInput register={register} error={errors.videoUrl} />
        <PriceAndOffers register={register} errors={errors} />
        <ReturnPolicies register={register} error={errors.returnPolicy} />
        <ActionButtons loading={loading} />
      </form>
    </div>
  );
}
