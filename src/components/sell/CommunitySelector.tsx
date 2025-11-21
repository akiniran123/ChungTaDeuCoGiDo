"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

type CommunitySelectorProps = {
  value: string | null;
  onChange: (value: string) => void;
  userId: string;
};

export default function CommunitySelector({
  value,
  onChange,
  userId,
}: CommunitySelectorProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCommunities = async () => {
      try {
        setLoading(true);

        // 1️⃣ Lấy danh sách community mà user là thành viên
        const { data: joined, error: joinErr } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", userId);

        if (joinErr) {
          console.error("❌ Lỗi lấy cộng đồng user tham gia:", joinErr.message);
          setLoading(false);
          return;
        }

        if (!joined || joined.length === 0) {
          setCommunities([]);
          setLoading(false);
          return;
        }

        const communityIds = joined.map((x) => x.community_id);

        // 2️⃣ Lấy thông tin community theo ID
        const { data: communityData, error: commErr } = await supabase
          .from("communities")
          .select("*")
          .in("id", communityIds);

        if (commErr) {
          console.error("❌ Lỗi lấy danh sách communities:", commErr.message);
        }

        setCommunities(communityData || []);
      } catch (err) {
        console.error("❌ Lỗi không mong muốn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [userId]);

  if (loading) return <p className="text-gray-500">Đang tải cộng đồng...</p>;

  if (communities.length === 0)
    return (
      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        Bạn chưa tham gia cộng đồng nào — hãy tham gia ít nhất 1 cộng đồng để
        đăng bán sản phẩm.
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Chọn cộng đồng đăng bài
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="">-- Chọn cộng đồng --</option>

        {communities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-500">
        Chỉ hiển thị các cộng đồng bạn đã tham gia.
      </p>
    </div>
  );
}
