"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";

import ListingTitleInput from "@/components/sell/pc//ListingTitleInput";
import DescriptionEditor from "@/components/sell/pc//DescriptionEditor";
import CategorySelect from "@/components/sell/pc//CategorySelect";
import ConditionSelector from "@/components/sell/pc//ConditionSelector";
import ImageUploader from "@/components/sell/pc//ImageUploader";
import PriceAndOffers from "@/components/sell/pc//PriceAndOffers";
import TechSpecsEditor from "@/components/sell/pc//TechSpecsEditor";
import PrivateToggle from "@/components/sell/pc//PrivateToggle";
import ReturnPolicies from "@/components/sell/pc//ReturnPolicies";
import ActionButtons from "@/components/sell/pc//ActionButtons";
import CommunitySelector from "@/components/sell/pc/CommunitySelector";

type SellForm = {
  title: string;
  description: string;
  price: string;
  category: string; // vẫn giữ trong payload nhưng không render select
  condition: string;
  images: string[];
  video_url: string | null;
  enable_offers: boolean;
  min_offer: string | null;
  quantity: number;
  specs: any[];
  is_private: boolean;
  return_policy: string | null;
  community_id: string | null;
  community_tag_id: string | null;
};

export default function SellPage() {
  const methods = useForm<SellForm>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "", // không hiển thị nhưng Supabase vẫn có cột này
      condition: "used",
      images: [],
      video_url: null,
      enable_offers: true,
      min_offer: null,
      quantity: 1,
      specs: [],
      is_private: false,
      return_policy: null,
      community_id: null,
      community_tag_id: null,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [communityTagId, setCommunityTagId] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState("");

  // Lấy user id
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setAuthUserId(data?.user?.id || "");
    }
    fetchUser();
  }, []);

  // ==========================
  // Submit
  // ==========================
  const onSubmit = async (data: SellForm) => {
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
      category: data.category, // vẫn gửi lên dù không có select UI
      is_private: data.is_private,
      condition: data.condition,
      specs: data.specs || [],
      images: JSON.stringify(data.images || []),
      image_url: data.images?.[0] ?? null,
      video_url: data.video_url,
      enable_offers: data.enable_offers,
      min_offer: data.min_offer ? Number(data.min_offer) : null,
      quantity: Number(data.quantity),
      return_policy: data.return_policy,
      sku: null,
      community_id: data.community_id,
      upvotes: 0,
      views: 0,
      is_completed: false,
    };

    const { data: insertedProduct, error: insertErr } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (insertErr || !insertedProduct) {
      console.error("Insert error:", insertErr);
      setMessage("🚨 Đăng sản phẩm thất bại!");
      setLoading(false);
      return;
    }

    const productId = insertedProduct.id;

    if (data.community_tag_id) {
      await supabase.from("product_tags").insert({
        product_id: productId,
        tag_id: data.community_tag_id,
      });
    }

    setMessage("✅ Đăng sản phẩm thành công!");
    reset();
    setCommunityTagId(null);
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-5 max-w-2xl mx-auto"
      >
        <ListingTitleInput error={errors.title} />
        <DescriptionEditor error={errors.description} />

        {/* ❌ Đã BỎ CategorySelect */}

        <ConditionSelector error={errors.condition} />

        <CommunitySelector
          userId={authUserId}
          value={watch("community_id") ?? ""}
          onChange={(v: string) => {
            methods.setValue("community_id", v || null);
            setCommunityTagId(null);
            methods.setValue("community_tag_id", null);
          }}
          selectedTag={communityTagId}
          onTagChange={(tag: string | null) => {
            setCommunityTagId(tag);
            methods.setValue("community_tag_id", tag ?? null);
          }}
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
