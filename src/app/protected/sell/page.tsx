"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";

import ListingTitleInput from "@/components/sell/ListingTitleInput";
import DescriptionEditor from "@/components/sell/DescriptionEditor";
import CategorySelect from "@/components/sell/CategorySelect";
import ConditionSelector from "@/components/sell/ConditionSelector";
import ImageUploader from "@/components/sell/ImageUploader";
import PriceAndOffers from "@/components/sell/PriceAndOffers";
import TechSpecsEditor from "@/components/sell/TechSpecsEditor";
import PrivateToggle from "@/components/sell/PrivateToggle";
import ReturnPolicies from "@/components/sell/ReturnPolicies";
import ActionButtons from "@/components/sell/ActionButtons";

import CommunitySelector from "@/components/sell/CommunitySelector";

export default function SellPage() {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "used",
      images: [],
      video_url: "",
      enable_offers: true,
      min_offer: "",
      quantity: 1,
      specs: [],
      is_private: false,
      return_policy: "",
      community_id: ""
    }
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = methods;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ⭐ Sửa lỗi Promise<string>: Lấy userId bằng useEffect
  const [authUserId, setAuthUserId] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data: auth } = await supabase.auth.getUser();
      setAuthUserId(auth?.user?.id || "");
    }
    fetchUser();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage(null);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      setMessage("⚠️ Bạn cần đăng nhập để đăng sản phẩm.");
      setLoading(false);
      return;
    }

    if (!data.community_id) {
      setMessage("⚠️ Bạn phải chọn cộng đồng để đăng bài.");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: auth.user.id,
      title: data.title,
      description: data.description,
      price: Number(data.price),
      category: data.category || null,
      is_private: data.is_private,
      condition: data.condition,
      specs: data.specs,
      images: data.images,
      video_url: data.video_url || null,
      enable_offers: data.enable_offers,
      min_offer: data.min_offer || null,
      quantity: Number(data.quantity),
      return_policy: data.return_policy || null,
      image_url: data.images?.[0] ?? null,
      sku: null,
      community_id: data.community_id,
      upvotes: 0,
      views: 0,
      is_completed: false
    };

    const { error } = await supabase.from("products").insert(payload);

    if (error) {
      setMessage("🚨 Đăng sản phẩm thất bại!");
      console.error(error);
    } else {
      setMessage("✅ Đăng sản phẩm thành công!");
      reset();
    }

    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5 max-w-2xl mx-auto">

        <ListingTitleInput error={errors.title} />

        <DescriptionEditor error={errors.description} />

        <CategorySelect error={errors.category} />

        <ConditionSelector error={errors.condition} />

        {/* ⭐ Chọn cộng đồng */}
        <CommunitySelector
          userId={authUserId}
          value={watch("community_id")}
          onChange={(v) => methods.setValue("community_id", v)}
        />

        <ImageUploader error={errors.images} />

        <PriceAndOffers watch={watch} error={errors.price} />

        <TechSpecsEditor error={errors.specs} />

        <PrivateToggle />

        <ReturnPolicies />

        <ActionButtons loading={loading} message={message} />

      </form>
    </FormProvider>
  );
}
