"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

export default function CreateProductPage() {
  const params = useSearchParams();
  const router = useRouter();
  const communityId = params.get("community_id");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Lấy user hiện tại từ Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id ?? null);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    if (!title) return alert("Vui lòng nhập tiêu đề");
    if (!userId) return alert("Vui lòng đăng nhập trước khi đăng sản phẩm");

    setLoading(true);

    // ✅ Ép kiểu để TypeScript không báo thiếu trường
    const { error } = await supabase.from("products").insert([
      {
        title,
        price,
        community_id: communityId,
        user_id: userId,
      } as Database["public"]["Tables"]["products"]["Insert"],
    ]);

    setLoading(false);
    if (error) alert(error.message);
    else router.push(`/community/${communityId}`);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm mới</h1>

      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-lg p-2 mb-3"
      />

      <input
        type="number"
        placeholder="Giá"
        value={price ?? ""}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full border rounded-lg p-2 mb-3"
      />

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
      >
        {loading ? "Đang tạo..." : "Tạo sản phẩm"}
      </button>
    </div>
  );
}
