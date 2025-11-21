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
  // 🔥 Lấy danh sách community user đã tham gia
  // ==========================
  useEffect(() => {
    if (!userId) return;

    const fetchCommunities = async () => {
      try {
        setLoading(true);

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
        Bạn chưa tham gia cộng đồng nào — hãy tham gia ít nhất 1 cộng đồng để
        đăng bán sản phẩm.
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
          Chỉ hiển thị các cộng đồng bạn đã tham gia.
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
