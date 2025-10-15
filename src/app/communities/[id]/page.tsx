"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

export default function CommunityDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCommunity = async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) setError(error.message);
      else setCommunity(data);
      setLoading(false);
    };

    fetchCommunity();
  }, [id]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Không tìm thấy cộng đồng.
      </div>
    );

  if (!community) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-4">{community.title}</h1>
        <p className="text-gray-600 mb-6">
          {community.description || "Chưa có mô tả."}
        </p>
        <div className="flex gap-3 text-gray-500 text-sm">
          <span>📂 {community.category || "Khác"}</span>
          <span>👥 {community.members ?? 0} thành viên</span>
          <span>🟢 {community.online ?? 0} online</span>
        </div>
      </div>
    </div>
  );
}
