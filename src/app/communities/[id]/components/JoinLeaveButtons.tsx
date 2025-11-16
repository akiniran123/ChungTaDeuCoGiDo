"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface JoinLeaveButtonProps {
  communityId: string;
  onChange?: (isMember: boolean) => void;
}

const JoinLeaveButton: React.FC<JoinLeaveButtonProps> = ({
  communityId,
  onChange,
}) => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Lấy user hiện tại
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUserId(data?.user?.id ?? null);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Kiểm tra thành viên
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkMembership = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("community_members")
        .select("*")
        .eq("community_id", communityId)
        .eq("user_id", userId)
        .maybeSingle();

      setIsMember(!!data);
      setLoading(false);
    };

    checkMembership();
  }, [userId, communityId]);

  // Tham gia cộng đồng
  const handleJoin = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để tham gia cộng đồng.");
      return;
    }

    setLoading(true);

    // 1. Kiểm tra community tồn tại
    const { data: community } = await supabase
      .from("communities")
      .select("id")
      .eq("id", communityId)
      .maybeSingle();

    if (!community) {
      alert("Cộng đồng không tồn tại.");
      setLoading(false);
      return;
    }

    // 2. Check nếu đã là member
    const { data: existed } = await supabase
      .from("community_members")
      .select("*")
      .eq("community_id", communityId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!existed) {
      // 3. Insert vào community_members
      const { error } = await supabase
        .from("community_members")
        .insert({
          community_id: communityId,
          user_id: userId,
          role: "member",
        });

      if (error) {
        alert("Không thể tham gia cộng đồng: " + error.message);
        setLoading(false);
        return;
      }
    }

    // 4. Insert vào bảng community_online_members
    await supabase.from("community_online_members").insert({
      community_id: communityId,
      user_id: userId,
    });

    setIsMember(true);
    onChange?.(true);
    setLoading(false);
  };

  // Rời cộng đồng
  const handleLeave = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để rời cộng đồng.");
      return;
    }

    if (!confirm("Bạn chắc chắn muốn rời khỏi cộng đồng?")) return;

    setLoading(true);

    // 1. Xóa khỏi community_members
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);

    if (error) {
      alert("Không thể rời khỏi cộng đồng: " + error.message);
      setLoading(false);
      return;
    }

    // 2. Xóa khỏi community_online_members
    await supabase
      .from("community_online_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);

    setIsMember(false);
    onChange?.(false);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => (isMember ? handleLeave() : handleJoin())}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            isMember
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : isMember ? (
          <span>Đã tham gia</span>
        ) : (
          <span>Tham gia cộng đồng</span>
        )}
      </button>

      <a
        href={`/communities/${communityId}/create-post`}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:shadow-sm"
      >
        Tạo bài đăng
      </a>
    </div>
  );
};

export default JoinLeaveButton;
