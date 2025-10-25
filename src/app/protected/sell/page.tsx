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
import ImageUploader from '@/components/sell/ImageUploader';

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
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

    // ✅ Kiểm tra hợp lệ
    const safe = productSchema.safeParse(data);
    if (!safe.success) {
      console.error(safe.error.format());
      alert('Vui lòng kiểm tra lại thông tin nhập!');
      setLoading(false);
      return;
    }

    try {
      // ✅ Lấy thông tin user hiện tại
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Bạn cần đăng nhập để đăng bài.');
        return;
      }

      // ✅ Chuẩn bị dữ liệu để lưu
      const payload = {
        user_id: user.id,
        title: data.title,
        category: data.category || null,
        is_private: data.isPrivate,
        condition: data.condition,
        description: data.description || null,
        specs: data.specs,
        images: imageUrl || null,
        video_url: data.videoUrl || null,
        price: data.price,
        enable_offers: data.enableOffers,
        min_offer: data.minOffer,
        quantity: data.quantity,
        sku: data.sku || null,
        return_policy: data.returnPolicy || null,
        community_id: null,
        upvotes: 0,
        views: 0,
        image_url: imageUrl || null, // 🔥 dùng cùng đường dẫn ảnh
      };

      // ✅ Gửi lên Supabase
      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) {
        console.error('Insert error:', insertError);
        alert(`Lỗi khi lưu sản phẩm: ${insertError.message}`);
        return;
      }

      alert('Đăng sản phẩm thành công 🎉');
      reset(); // Xóa form
      router.push('/'); // Quay về trang chủ
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">
        🛍️ Đăng bán sản phẩm mới
      </h1>

      <BankAccountBanner />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Thông tin cơ bản --- */}
        <div className="border rounded-lg p-5 space-y-6 shadow-sm">
          <h2 className="font-semibold text-lg">Thông tin sản phẩm</h2>
          <CategorySelect register={register} error={errors.category} />
          <ListingTitleInput register={register} error={errors.title} />
          <PrivateToggle register={register} />

          {/* Upload ảnh */}
          <ImageUploader onUploadComplete={(url) => setImageUrl(url)} />
          {imageUrl && (
            <p className="text-sm text-green-600">
              ✅ Ảnh đã tải lên thành công
            </p>
          )}
        </div>

        {/* --- Thông tin chi tiết --- */}
        <TechSpecsEditor control={control} />
        <ConditionSelectorSection register={register} />
        <DescriptionEditorSection
          control={control}
          error={errors.description}
        />
        <ProductVideoInput register={register} error={errors.videoUrl} />
        <PriceAndOffers register={register} errors={errors} />
        <ReturnPolicies register={register} error={errors.returnPolicy} />

        <ActionButtons loading={loading} />
      </form>
    </div>
  );
}
