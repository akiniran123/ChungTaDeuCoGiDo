"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  PlusCircle,
  Users,
  Tag,
  Globe,
  Eye,
  Heart,
} from "lucide-react";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Lấy dữ liệu từ Supabase
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin community
        const { data: communityData, error: communityError } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityError) throw communityError;
        setCommunity(communityData);

        // Lấy danh sách sản phẩm trong community
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("community_id", id)
          .order("created_at", { ascending: false });

        if (productError) throw productError;
        setProducts(productData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ⏳ Loading
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-500 mr-2" />
        Đang tải dữ liệu...
      </div>
    );

  // ❌ Error
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Lỗi tải dữ liệu: {error}
      </div>
    );

  if (!community) return null;

  // 🌎 Giao diện chính
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* 🏡 Tiêu đề cộng đồng */}
        <div className="mb-8 border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {community.title}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                {community.description || "Chưa có mô tả cho cộng đồng này."}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />{" "}
                  {community.category || "Chưa phân loại"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />{" "}
                  {community.members ?? 0} thành viên
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />{" "}
                  {community.online ?? 0} đang hoạt động
                </span>
              </div>
            </div>

            {/* 🧩 Nút tạo bài đăng */}
            <button
              onClick={() =>
                router.push(`/create-product?community_id=${community.id}`)
              }
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Tạo bài đăng
            </button>
          </div>
        </div>

        {/* 🗂️ Danh sách bài đăng */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bài đăng trong cộng đồng
          </h2>

          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              Chưa có bài đăng nào trong cộng đồng này.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="group cursor-pointer border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={p.image_url || "/placeholder.png"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {p.description || "Không có mô tả."}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <p className="text-indigo-600 font-semibold mb-1">
                        {p.price ? `${p.price.toLocaleString()}₫` : "Liên hệ"}
                      </p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {p.views ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-500" />{" "}
                          {p.upvotes ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
