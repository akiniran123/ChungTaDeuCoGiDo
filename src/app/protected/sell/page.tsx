"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";

import ListingTitleInput from "@/components/sell/pc//ListingTitleInput";
import DescriptionEditor from "@/components/sell/pc//DescriptionEditor";
import ConditionSelector from "@/components/sell/pc//ConditionSelector";
import ImageUploader from "@/components/sell/pc//ImageUploader";
import PriceAndOffers from "@/components/sell/pc//PriceAndOffers";
import TechSpecsEditor from "@/components/sell/pc//TechSpecsEditor";
import PrivateToggle from "@/components/sell/pc//PrivateToggle";
import ReturnPolicies from "@/components/sell/pc//ReturnPolicies";
import CommunitySelector from "@/components/sell/pc/CommunitySelector";

import type { ProductFormData } from "@/types/form"; // dùng type mà các component con mong đợi

type Spec = {
  key: string;
  value: string | number | boolean | null;
};

type SellForm = {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  images: string[];
  video_url: string | null;
  enable_offers: boolean;
  min_offer: string | null;
  quantity: number;
  specs: Spec[];
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
      category: "",
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

  // Lấy user id (client-only, safe)
  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseClientOrNull();
    if (!supabase) {
      if (mounted) setAuthUserId("");
      return;
    }

    async function fetchUser() {
      try {
        const { data } = await supabase!.auth.getUser();
        if (!mounted) return;
        setAuthUserId(data?.user?.id || "");
      } catch (err) {
        console.warn("Failed to get user:", err);
        if (mounted) setAuthUserId("");
      }
    }
    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================
  // Submit
  // ==========================
  const onSubmit = async (data: SellForm) => {
    setLoading(true);
    setMessage(null);

    const supabase = getSupabaseClientOrNull();
    if (!supabase) {
      setMessage("⚠️ Supabase chưa được cấu hình cho môi trường này.");
      setLoading(false);
      return;
    }

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
      category: data.category,
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
      tags: null,
    };

    try {
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
    } catch (err) {
      console.error("Insert unexpected error:", err);
      setMessage("🚨 Đã xảy ra lỗi khi đăng sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5 max-w-2xl mx-auto">
        <ListingTitleInput error={errors.title} />

        {/* Cast cục bộ sang kiểu mà component con mong đợi (ProductFormData).
            Ép qua unknown để tránh lỗi tương thích nội bộ Control<T> */}
        <DescriptionEditor
          control={methods.control as unknown as Control<ProductFormData>}
          error={errors.description}
        />

        <ConditionSelector error={errors.condition?.message} />

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

        <ImageUploader error={errors.images as FieldErrors<ProductFormData> | undefined} />

        <PriceAndOffers />

        <TechSpecsEditor control={methods.control as unknown as Control<ProductFormData>} />

        <PrivateToggle />

        <ReturnPolicies />

        {/* Nút đăng sản phẩm trung tính, nhấn chỉ hơi tối */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-60 bg-transparent hover:bg-gray-100/50 active:bg-gray-200/50 dark:hover:bg-gray-800/30 dark:active:bg-gray-800/20"
          >
            {loading ? "Đang đăng..." : "Đăng sản phẩm"}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </FormProvider>
  );
}