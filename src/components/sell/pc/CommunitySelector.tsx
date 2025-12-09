"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type CommunityTag = Database["public"]["Tables"]["community_tags"]["Row"];

type CommunitySelectorProps = {
  value: string | null; // community_id
  onChange: (value: string) => void;
  userId: string;

  selectedTag?: string | null;
  onTagChange?: (value: string | null) => void;
};

export default function CommunitySelector({
  value,
  onChange,
  userId,
  selectedTag,
  onTagChange,
}: CommunitySelectorProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityTags, setCommunityTags] = useState<CommunityTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(false);

  // ==========================
  // 🔥 Lấy tất cả cộng đồng (không cần user tham gia)
  // ==========================
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);

        const { data: communityData, error: commErr } = await supabase
          .from("communities")
          .select("*")
          .order("created_at", { ascending: false });

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
  }, []);

  // ==========================
  // 🔥 Khi chọn community → load tags
  // ==========================
  useEffect(() => {
    if (!value) {
      setCommunityTags([]);
      onTagChange?.(null); // reset tag khi đổi community
      return;
    }

    const fetchTags = async () => {
      setTagsLoading(true);

      const { data, error } = await supabase
        .from("community_tags")
        .select("*")
        .eq("community_id", value)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Lỗi tải tag:", error.message);
      }

      setCommunityTags(data || []);
      setTagsLoading(false);
    };

    fetchTags();
  }, [value]);

  // ==========================
  // UI
  // ==========================
  if (loading) return <p className="text-gray-500">Đang tải cộng đồng...</p>;

  if (communities.length === 0)
    return (
      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        Hiện tại chưa có cộng đồng nào.
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* SELECT COMMUNITY */}
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
          Bạn có thể chọn bất kỳ cộng đồng nào.
        </p>
      </div>

      {/* TAG SELECTOR */}
      {value && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Chọn tag của cộng đồng
          </label>

          {tagsLoading ? (
            <p className="text-gray-400 text-sm">Đang tải tag...</p>
          ) : communityTags.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Cộng đồng này chưa có tag nào.
            </p>
          ) : (
            <select
              value={selectedTag ?? ""}
              onChange={(e) => onTagChange?.(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">-- Chọn tag --</option>

              {communityTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
