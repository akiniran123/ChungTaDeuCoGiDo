"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// 🔐 Login modal
import LoginModal from "@/components/auth/LoginModal";

type Community = {
  id: string;
  title: string | null;
  avatar_url: string | null;
};

export default function SidebarCommunity() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.auth.getUser();

      setUserId(data.user?.id || null);

      if (!data.user) {
        setLoading(false);
        return;
      }

      const { data: rows } = await supabase
        .from("community_members")
        .select(`
          community_id,
          communities (
            id,
            title,
            avatar_url
          )
        `)
        .eq("user_id", data.user.id);

      const mapped: Community[] = (rows || [])
        .map((item) => item.communities)
        .filter(Boolean);

      setCommunities(mapped);
      setLoading(false);
    }

    fetchData();
  }, []);

  // 🔐 Yêu cầu đăng nhập
  const handleCreateCommunity = () => {
    if (!userId) {
      alert("Bạn cần đăng nhập hoặc đăng ký để sử dụng tính năng này");
      setShowLogin(true);
      return;
    }

    router.push("/create-community");
  };

  return (
    <>
      <div className="px-4 mb-6 mt-3">
        {/* Header */}
        <div className="flex items-center justify-between text-xs uppercase text-gray-500 font-semibold tracking-wider py-1">
          Cộng đồng
        </div>

        {/* Tạo cộng đồng */}
        <div
          onClick={handleCreateCommunity}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-900 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo cộng đồng</span>
        </div>

        {/* Danh sách cộng đồng */}
        {loading ? (
          <p className="text-sm text-gray-400 mt-2">Đang tải...</p>
        ) : communities.length === 0 ? (
          <p className="text-sm text-gray-400 mt-2">
            Bạn chưa tham gia cộng đồng nào.
          </p>
        ) : (
          <div className="mt-1 space-y-1">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-900"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={c.avatar_url || "/default-community.png"}
                    alt={c.title ? `${c.title} avatar` : "Community avatar"}
                    width={20}
                    height={20}
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <span className="truncate">{c.title}</span>
                <Star className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 🔐 Login Modal – chỉ mở khi click & chưa login */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
