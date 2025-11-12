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
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    custom: true,
    communities: true,
  });
  const [communities, setCommunities] = useState<
    { id: string; title: string | null }[]
  >([]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="w-64 h-screen bg-white text-gray-900 overflow-y-auto border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/reddit-icon.svg" alt="logo" className="w-6 h-6" />
          <span className="font-semibold text-black">reddit</span>
        </Link>
      </div>

      {/* MAIN LINKS */}
      <div className="mt-3">
        {[
          { label: "Home", icon: <Home className="w-4 h-4" />, href: "/" },
          { label: "Popular", icon: <Flame className="w-4 h-4" />, href: "/popular" },
          { label: "Answers (Beta)", icon: <HelpCircle className="w-4 h-4" />, href: "/answers" },
          { label: "Explore", icon: <Compass className="w-4 h-4" />, href: "/explore" },
          { label: "All", icon: <List className="w-4 h-4" />, href: "/all" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg mx-2 transition-colors"
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </div>

      <hr className="border-gray-200 my-3" />

      {/* CUSTOM FEEDS */}
      <div className="px-4">
        <button
          onClick={() => toggleSection("custom")}
          className="flex items-center justify-between w-full text-xs uppercase text-gray-500 font-semibold tracking-wider py-1"
        >
          Custom Feeds
          {openSections.custom ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {openSections.custom && (
          <div className="mt-1 space-y-1">
            <Link
              href="/create-feed"
              className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Custom Feed
            </Link>
            <div className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800">
              <img
                src="/default-feed.png"
                alt="feed"
                className="w-5 h-5 rounded-full mr-2"
              />
              myFeed
              <Star className="w-4 h-4 ml-auto text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-200 my-3" />

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
              className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Community
            </Link>
            <Link
              href="/manage-communities"
              className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800"
            >
              <Users className="w-4 h-4 mr-2" /> Manage Communities
            </Link>

            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.id}`}
                className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800"
              >
                <img
                  src="/default-community.png"
                  alt={c.title || "community"}
                  className="w-5 h-5 rounded-full mr-2"
                />
                {c.title || "Không tên"}
                <Star className="w-4 h-4 ml-auto text-gray-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
