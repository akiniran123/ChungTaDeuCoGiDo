"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Flame,
  HelpCircle,
  Compass,
  List,
  Plus,
  Users,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SidebarLeft() {
  type SectionKey = "games" | "custom" | "communities";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    games: false,
    custom: true,
    communities: true,
  });

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [communities, setCommunities] = useState<
    { id: string; title: string | null }[]
  >([]);

  useEffect(() => {
    async function fetchCommunities() {
      const { data, error } = await supabase
        .from("communities")
        .select("id, title")
        .order("created_at", { ascending: false });
      if (error) console.error("Lỗi tải communities:", error);
      else setCommunities(data || []);
    }

    fetchCommunities();
  }, []);

  return (
    <aside className="fixed top-10 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto text-gray-900 z-40">

      {/* MAIN LINKS */}
      <nav className="mt-2">
        {[
          { label: "Home", icon: Home, href: "/" },
          { label: "Popular", icon: Flame, href: "/popular" },

          // 🔥 ĐÃ ĐỔI /explore → /communities
          { label: "Explore", icon: Compass, href: "/communities" },

          { label: "All", icon: List, href: "/all" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md mx-2 transition-colors
            hover:bg-gray-100 text-gray-800`}
          >
            <item.icon className="w-4 h-4 text-gray-600" />
            <span className="truncate">{item.label}</span>
            {item.label === "Answers" && (
              <span className="text-[10px] text-red-600 font-semibold ml-1">
                BETA
              </span>
            )}
          </Link>
        ))}
      </nav>

      <hr className="border-gray-200 my-3 mx-2" />

      {/* COMMUNITIES */}
      <div className="px-4 mb-6">
        <button
          onClick={() => toggleSection("communities")}
          className="flex items-center justify-between w-full text-xs uppercase text-gray-500 font-semibold tracking-wider py-1"
        >
          Communities
          {openSections.communities ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {openSections.communities && (
          <div className="mt-1 space-y-1">
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
