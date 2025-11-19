"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Flame,
  Compass,
  List,
  Plus,
  Users,
  Star,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SidebarLeft() {
  const [communities, setCommunities] = useState<
    { id: string; title: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          console.warn("⚠️ Không có user đăng nhập:", userError);
          setLoading(false);
          return;
        }

        // 🔥 Lấy danh sách cộng đồng user đang tham gia
        const { data, error } = await supabase
          .from("community_members")
          .select(
            `
            community_id,
            communities (
              id,
              title
            )
          `
          )
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Lỗi tải communities:", error);
          setLoading(false);
          return;
        }

        // Map dữ liệu về dạng gọn
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

  return (
    <aside className="fixed top-10 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto text-gray-900 z-40 shadow-sm">
      {/* MAIN NAVIGATION */}
      <nav className="mt-2">
        {[
          { label: "Home", icon: Home, href: "/" },
          { label: "Popular", icon: Flame, href: "/popular" },
          { label: "Explore", icon: Compass, href: "/explore" },
          { label: "All", icon: List, href: "/all" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-sm rounded-md mx-2 hover:bg-gray-100 text-gray-800"
          >
            <item.icon className="w-4 h-4 text-gray-600" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <hr className="border-gray-200 my-3 mx-2" />

      {/* COMMUNITIES SECTION */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between text-xs uppercase text-gray-500 font-semibold tracking-wider py-1">
          Communities
          <ChevronDown className="w-4 h-4" />
        </div>

        {/* CREATE / MANAGE LINKS */}
        <Link
          href="/create-community"
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-800 rounded hover:bg-gray-100"
        >
          <Plus className="w-4 h-4 text-gray-600" />
          <span>Create Community</span>
        </Link>

        <Link
          href="/manage-communities"
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-800 rounded hover:bg-gray-100"
        >
          <Users className="w-4 h-4 text-gray-600" />
          <span>Manage Communities</span>
        </Link>

        {/* COMMUNITY LIST */}
        {loading ? (
          <p className="text-sm text-gray-400 mt-2">Loading...</p>
        ) : communities.length === 0 ? (
          <p className="text-sm text-gray-400 mt-2">
            You haven’t joined any communities yet.
          </p>
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
