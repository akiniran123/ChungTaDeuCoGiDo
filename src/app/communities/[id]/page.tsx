"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2, PlusCircle } from "lucide-react";
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

  // --- Lấy dữ liệu community + products ---
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Lấy thông tin cộng đồng
        const { data: communityData, error: communityError } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityError) throw communityError;
        setCommunity(communityData);

        // 2️⃣ Lấy danh sách products trong cộng đồng này
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

  // --- Loading ---
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  // --- Error ---
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Lỗi: {error}
      </div>
    );

  if (!community) return null;

  // --- Giao diện chính ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-4">{community.title}</h1>
        <p className="text-gray-600 mb-6">
          {community.description || "Chưa có mô tả."}
        </p>

        <div className="flex gap-3 text-gray-500 text-sm mb-8">
          <span>📂 {community.category || "Khác"}</span>
          <span>👥 {community.members ?? 0} thành viên</span>
          <span>🟢 {community.online ?? 0} online</span>
        </div>

        {/* --- Nút tạo bài đăng --- */}
        <button
          onClick={() => router.push(`/create-product?community_id=${community.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition mb-6"
        >
          <PlusCircle className="w-5 h-5" />
          Tạo bài đăng
        </button>

        {/* --- Danh sách sản phẩm --- */}
        <h2 className="text-xl font-semibold mb-3">Bài đăng trong cộng đồng</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Chưa có bài đăng nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50"
              >
                <img
                  src={p.image_url || "/placeholder.png"}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-blue-600 font-medium mt-2">
                  {p.price ? `${p.price.toLocaleString()}₫` : "Liên hệ"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
