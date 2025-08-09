'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostgrestError } from '@supabase/supabase-js';

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

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    console.log('Form submit data (raw):', data);

    const safe = productSchema.safeParse(data);
    if (!safe.success) {
      console.error('Zod validation failed:', safe.error.format());
      alert('Validation failed — check console for details.');
      setLoading(false);
      return;
    }

    try {
      // Check user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Auth getUser error or no user:', userError);
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
        price: data.price,
        enable_offers: data.enableOffers,
        min_offer: data.minOffer,
        quantity: data.quantity,
        sku: data.sku || null,
        return_policy: data.returnPolicy || null,
      };

      console.log('Insert payload:', payload);

      const { data: insertedRows, error: insertError } = await supabase
        .from('products')
        .insert([payload])
        .select('*');

      if (insertError) {
        console.error('Insert error object:', insertError);
        alert(`Insert error: ${insertError.message}`);
        return;
      }

      console.log('Insert success, returned rows:', insertedRows);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Unexpected error during submit:', err);
        alert(`Unexpected error: ${err.message}`);
      } else {
        console.error('Unexpected non-Error thrown:', err);
        alert(`Unexpected error: ${JSON.stringify(err)}`);
      }
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
