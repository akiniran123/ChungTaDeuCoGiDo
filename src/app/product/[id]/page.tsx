"use client";

import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params theo chuẩn mới Next.js 15
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        // 🔹 Lấy dữ liệu sản phẩm
        const { data: prod, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (prodErr) throw prodErr;
        setProduct(prod);

        // 🔹 Lấy thông tin người đăng (đầy đủ field để khớp kiểu User)
        if (prod?.user_id) {
          const { data: usr, error: usrErr } = await supabase
            .from("users")
            .select(
              "id, username, email, created_at, updated_at, avatar_url, karma, is_online, address, identity, phone, birth"
            )
            .eq("id", prod.user_id)
            .single();

          if (usrErr) console.warn("User fetch error:", usrErr.message);
          else setSeller(usr);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Không thể tải dữ liệu bài đăng");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-500 mr-2" />
        Đang tải bài đăng...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="mb-3">❌ {error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Quay lại
        </button>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="mb-3">Bài đăng không tồn tại hoặc đã bị xoá.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        {/* Ảnh sản phẩm */}
        <div className="w-full h-80 overflow-hidden rounded-xl mb-6">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thông tin chi tiết */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {product.description || "Không có mô tả chi tiết."}
        </p>

        <div className="text-2xl font-semibold text-indigo-600 mb-6">
          {product.price ? `${product.price.toLocaleString()}₫` : "Liên hệ"}
        </div>

        {/* Thông tin người đăng */}
        {seller && (
          <div className="flex items-center gap-3 mt-8 border-t pt-6">
            <img
              src={seller.avatar_url || "/default-avatar.png"}
              alt={seller.username || "Người đăng"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {seller.username || "Người dùng"}
              </p>
              <p className="text-sm text-gray-500">Người đăng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
