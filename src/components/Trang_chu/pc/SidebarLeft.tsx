"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Compass, Plus, Users, Star, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import MessagesMenu from "@/components/Navbar/pc/LogoSearchIcon/MessagesMenu";
import NewsMenu, { toggleNewsMenu } from "@/components/Navbar/pc/LogoSearchIcon/NewsMenu";
import StartSellingButtons from "@/components/Navbar/pc/LogoSearchIcon/StartSellingButtons";

export default function SidebarLeft() {
  const [communities, setCommunities] = useState<{ id: string; title: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("community_members")
          .select(`
            community_id,
            communities (
              id,
              title
            )
          `)
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Lỗi tải communities:", error);
          setLoading(false);
          return;
        }

        const mapped = (data || [])
          .map((item) => item.communities)
          .filter(Boolean);

        setCommunities(mapped);
      } catch (err) {
        console.error("🔥 Lỗi ngoài ý muốn:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, []);

  const handleRequireLogin = () => {
    alert("Bạn cần đăng nhập trước!");
  };

  return (
    <aside
      className="
        fixed left-0 top-[6.5rem]
        w-64 h-[calc(100vh-6.5rem)]
        bg-white border-r border-gray-200
        overflow-y-auto z-40 shadow-sm text-gray-900
      "
    >
      <nav className="mt-2 space-y-1">
        <SidebarLink href="/" icon={<Home className="w-6 h-6 text-gray-700" />} label="Home" />
        <SidebarLink href="/communities" icon={<Compass className="w-6 h-6 text-gray-700" />} label="Explore" />
        <SidebarLink
          href={userId ? `/messages/${userId}` : "/messages"}
          icon={<MessagesMenu />}
          label="Messages"
        />
        <div
          className="relative z-50 flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleNewsMenu();
          }}
        >
          <NewsMenu />
          <span className="text-base font-medium text-gray-900">Tin tức</span>
        </div>
      </nav>

      <div className="px-5 mt-3 mb-2">
        <StartSellingButtons onRequireLogin={handleRequireLogin} />
      </div>

      <hr className="border-gray-200 my-3 mx-2" />

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between text-xs uppercase text-gray-500 font-semibold tracking-wider py-1">
          Communities
          <ChevronDown className="w-4 h-4" />
        </div>

        <SidebarLinkSmall href="/create-community" icon={<Plus className="w-4 h-4 text-gray-600" />} label="Create Community" />
        <SidebarLinkSmall href="/manage-communities" icon={<Users className="w-4 h-4 text-gray-600" />} label="Manage Communities" />

        {loading ? (
          <p className="text-sm text-gray-400 mt-2">Loading...</p>
        ) : communities.length === 0 ? (
          <p className="text-sm text-gray-400 mt-2">You haven’t joined any communities yet.</p>
        ) : (
          <div className="mt-1 space-y-1">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.id}`}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-800 rounded hover:bg-gray-100"
              >
                <img
                  src="/default-community.png"
                  alt={c.title || "community"}
                  className="w-5 h-5 rounded-full"
                />
                <span className="truncate">{c.title || "Không tên"}</span>
                <Star className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-3 text-base font-medium rounded-xl mx-2 hover:bg-gray-100 text-gray-900"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function SidebarLinkSmall({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-800 rounded hover:bg-gray-100"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}