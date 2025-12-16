"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { User } from "lucide-react";

interface CommunityMemberSidebarProps {
  communityId: string;
}

interface Member {
  user_id: string;
  role?: string | null;
  users?: {
    username: string | null;
    avatar_url: string | null;
  };
}

const MembersSidebar: React.FC<CommunityMemberSidebarProps> = ({ communityId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("community_members")
        .select(`
          user_id,
          role,
          users (
            username,
            avatar_url
          )
        `)
        .eq("community_id", communityId);

      if (error) throw error;

      if (data) {
        const sortedMembers = [...data].sort((a, b) =>
          a.role === "owner" ? -1 : b.role === "owner" ? 1 : 0
        );
        setMembers(sortedMembers);
      }
    } catch (err) {
      console.error("Lỗi khi fetch members:", err);
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  // 🟦 Load lần đầu
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 🟩 Realtime listener: auto update khi có người join / leave
  useEffect(() => {
    const channel = supabase
      .channel(`community-members-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // listen INSERT + DELETE + UPDATE
          schema: "public",
          table: "community_members",
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          fetchMembers(); // 🔥 reload ngay khi có thay đổi
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId, fetchMembers]);

  return (
    <aside className="hidden lg:flex flex-col w-[300px] bg-white border-l border-gray-200 rounded-r-2xl">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-100">
        Thành viên
      </h2>

      {loading ? (
        <p className="px-4 py-2 text-sm text-gray-500">Đang tải...</p>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div
                key={member.user_id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                  member.role === "owner"
                    ? "bg-yellow-50 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {member.users?.avatar_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={member.users.avatar_url}
                        alt={`${member.users?.username ?? "Người dùng"} avatar`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-sm">
                    {member.users?.username || "Người dùng"}
                    {member.role === "owner" && " (Chủ)"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {member.user_id.slice(0, 6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default MembersSidebar;