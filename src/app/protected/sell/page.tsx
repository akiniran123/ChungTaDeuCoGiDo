'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { supabase } from '@/lib/supabase/client'
import { productSchema, ProductFormData } from '@/types/form'

// ✅ Tất cả imports theo default export
import BankAccountBanner from '@/components/sell/BankAccountBanner'
import CategorySelect from '@/components/sell/CategorySelect'
import ListingTitleInput from '@/components/sell/ListingTitleInput'
import PrivateToggle from '@/components/sell/PrivateToggle'
import TechSpecsEditor from '@/components/sell/TechSpecsEditor'
import ConditionSelectorSection from '@/components/sell/ConditionSelector'
import DescriptionEditorSection from '@/components/sell/DescriptionEditor'
import ProductVideoInput from '@/components/sell/ProductVideoInput'
import PriceAndOffers from '@/components/sell/PriceAndOffers'
import ReturnPolicies from '@/components/sell/ReturnPolicies'
import ActionButtons from '@/components/sell/ActionButtons'
import ImageUploader from '@/components/sell/ImageUploader'


export default function SellPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [price, setPrice] = useState<number>(0)
  const [enableOffers, setEnableOffers] = useState<boolean>(false)
  const [minOffer, setMinOffer] = useState<number>(0)

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
      quantity: 1,
      sku: '',
      returnPolicy: undefined,
    },
  })

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Bạn cần đăng nhập để đăng bài.')
        setLoading(false)
        return
      }

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
        price,
        enable_offers: enableOffers,
        min_offer: minOffer,
        quantity: data.quantity,
        sku: data.sku || null,
        return_policy: data.returnPolicy || null,
        community_id: null,
        upvotes: 0,
        views: 0,
        image_url: imageUrl || null,
      }

      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error

      alert('Đăng sản phẩm thành công 🎉')
      reset()
      setImageUrl(null)
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Đã xảy ra lỗi, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-center text-purple-600">
        🛍️ Đăng bán sản phẩm mới
      </h1>

      <BankAccountBanner />

      <div className="space-y-6 border rounded-lg p-5 shadow-sm">
        <h2 className="font-semibold text-lg">Thông tin sản phẩm</h2>

        <CategorySelect register={register} error={errors.category} />
        <ListingTitleInput register={register} error={errors.title} />
        <PrivateToggle register={register} />

        <ImageUploader value={imageUrl} onChange={setImageUrl} />
        {imageUrl && (
          <p className="text-sm text-green-600">✅ Ảnh đã tải lên thành công</p>
        )}

        <TechSpecsEditor control={control} />
        <ConditionSelectorSection register={register} />
        <DescriptionEditorSection control={control} error={errors.description} />
        <ProductVideoInput register={register} error={errors.videoUrl} />
        <PriceAndOffers
          price={price}
          enableOffers={enableOffers}
          minOffer={minOffer}
          onChangePrice={setPrice}
          onChangeEnableOffers={setEnableOffers}
          onChangeMinOffer={setMinOffer}
        />
        <ReturnPolicies register={register} error={errors.returnPolicy} />

        <ActionButtons loading={loading} onPublish={handleSubmit(onSubmit)} />
      </div>
    </div>
  )
}
