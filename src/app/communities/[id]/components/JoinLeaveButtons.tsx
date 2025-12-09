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
  const [isOwner, setIsOwner] = useState(false);

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

  // Kiểm tra thành viên + role
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
      setIsOwner(data?.role === "owner");
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

    const { data: existed } = await supabase
      .from("community_members")
      .select("*")
      .eq("community_id", communityId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!existed) {
      const { error } = await supabase.from("community_members").insert({
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

    await supabase.from("community_online_members").insert({
      community_id: communityId,
      user_id: userId,
    });

    setIsMember(true);
    setIsOwner(false);
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

    await supabase
      .from("community_online_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);

    setIsMember(false);
    setIsOwner(false);
    onChange?.(false);
    setLoading(false);
  };

  // XÓA CỘNG ĐỒNG – CHỈ OWNER
  const handleDeleteCommunity = async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa hoàn toàn cộng đồng này không? Hành động này không thể hoàn tác!"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      await supabase
        .from("community_online_members")
        .delete()
        .eq("community_id", communityId);

      await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId);

      const { error } = await supabase
        .from("communities")
        .delete()
        .eq("id", communityId);

      if (error) throw error;

      alert("Cộng đồng đã được xóa hoàn toàn.");
      window.location.href = "/communities";
    } catch (err: any) {
      alert("Lỗi khi xóa cộng đồng: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">

      {/* NÚT THAM GIA */}
      {!isMember ? (
        <button
          type="button"
          onClick={handleJoin}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-blue-600 text-white hover:bg-blue-700
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            "Tham gia cộng đồng"
          )}
        </button>
      ) : (
        <>
          {/* CHỈ CÒN NÚT RỜI CỘNG ĐỒNG */}
          <button
            type="button"
            onClick={handleLeave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
              bg-gray-100 text-gray-900 hover:bg-gray-200 cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              "Rời cộng đồng"
            )}
          </button>
        </>
      )}

      {/* XÓA CỘNG ĐỒNG (OWNER) */}
      {isOwner && (
        <button
          type="button"
          onClick={handleDeleteCommunity}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
            bg-gray-100 text-gray-900 hover:bg-gray-200 cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xóa...</span>
            </>
          ) : (
            "Xóa cộng đồng"
          )}
        </button>
      )}
    </div>
  );
};

export default JoinLeaveButton;
