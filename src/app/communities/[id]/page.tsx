"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

export default function CommunityDetailPage() {
  const params = useParams(); // ✅ lấy params dạng Record
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // ép về string

  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCommunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setCommunity(data);
      } catch (err: any) {
        console.error("Lỗi tải cộng đồng:", err);
        setError("Không tìm thấy cộng đồng hoặc đã bị xóa.");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        {error}
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cộng đồng không tồn tại.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.title}</h1>
        <p className="text-gray-600 mb-4">{community.description || "Chưa có mô tả."}</p>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <span>📂 {community.category || "Khác"}</span>
          <span>👥 {community.members ?? 0} thành viên</span>
          <span>🟢 {community.online ?? 0} đang online</span>
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Thảo luận</h2>
          <p className="text-gray-500">
            Tính năng bài viết, bình luận... sẽ được thêm sau 🚀
          </p>
        </div>
      </div>
    </div>
  );
}