"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import ActionButtons from "@/components/sell/ActionButtons";

type ProductFormData = {
  title: string;
  description: string;
  price: number;
};

export default function SellPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Submit
  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    console.log("➡️ Bắt đầu đăng sản phẩm");

    setLoading(true);
    setMessage(null);

    // ✅ Lấy user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("⚠️ Bạn cần đăng nhập để đăng sản phẩm.");
      setLoading(false);
      return;
    }

    const productData = {
      user_id: user.id,
      title: data.title,
      description: data.description,
      price: data.price,

      // ✅ Các field còn lại set mặc định
      category: null,
      is_private: false,
      condition: "used",
      specs: {},
      images: null,
      video_url: null,
      enable_offers: true,
      min_offer: null,
      quantity: 1,
      sku: null,
      return_policy: null,
      image_url: null,
      community_id: null,
      upvotes: 0,
      views: 0,
      is_completed: false,
    };

    const { error } = await supabase.from("products").insert(productData);

    if (error) {
      console.error("❌ Lỗi khi đăng sản phẩm:", error);
      setMessage("🚨 Đăng sản phẩm thất bại!");
    } else {
      setMessage("✅ Đăng sản phẩm thành công!");
      reset(); // Clear form
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Đăng sản phẩm mới</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border rounded-lg p-5 shadow-sm"
      >
        <div>
          <label className="block font-medium mb-1">Tên sản phẩm</label>
          <input
            {...register("title", { required: true })}
            className="w-full border rounded p-2"
            placeholder="Nhập tên sản phẩm..."
          />
          {errors.title && (
            <p className="text-red-500 text-sm">Vui lòng nhập tên sản phẩm.</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border rounded p-2"
            placeholder="Nhập mô tả..."
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Giá (VNĐ)</label>
          <input
            type="number"
            {...register("price", { required: true, min: 1000 })}
            className="w-full border rounded p-2"
            placeholder="Nhập giá..."
          />
          {errors.price && (
            <p className="text-red-500 text-sm">Giá phải lớn hơn 1,000đ.</p>
          )}
        </div>

        {/* ✅ Button submit trong form */}
        <ActionButtons loading={loading} message={message} />
      </form>
    </div>
  );
}
