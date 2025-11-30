"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Compass, Plus, Users, Star, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import MessagesMenu from "@/components/Navbar/pc/LogoSearchIcon/MessagesMenu";
import NewsMenu, { toggleNewsMenu } from "@/components/Navbar/pc/LogoSearchIcon/NewsMenu";
import StartSellingButtons from "@/components/Navbar/pc/LogoSearchIcon/StartSellingButtons";

import { createPortal } from "react-dom";

export default function SidebarLeft() {
  const [communities, setCommunities] = useState<
    { id: string; title: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [openMessages, setOpenMessages] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

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
    <>
      {/* SIDE BAR TRÁI */}
      <aside
        className="
          fixed top-10 left-0 
          w-64 h-[calc(100vh-4rem)]
          bg-white border-r border-gray-200 
          overflow-y-visible 
          text-gray-900 z-40 shadow-sm
        "
      >
        <nav className="mt-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-4 px-5 py-3 text-base font-medium rounded-xl mx-2 hover:bg-gray-100 text-gray-900"
          >
            <Home className="w-6 h-6 text-gray-700" />
            <span>Home</span>
          </Link>

          <Link
            href="/communities"
            className="flex items-center gap-4 px-5 py-3 text-base font-medium rounded-xl mx-2 hover:bg-gray-100 text-gray-900"
          >
            <Compass className="w-6 h-6 text-gray-700" />
            <span>Explore</span>
          </Link>

          <div
            onClick={() => setOpenMessages(!openMessages)}
            className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <MessagesMenu />
            <span className="text-base font-medium text-gray-900">Messages</span>
          </div>

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

        {/* Sell */}
        <div className="px-5 mt-3 mb-2">
          <StartSellingButtons onRequireLogin={handleRequireLogin} />
        </div>

        <hr className="border-gray-200 my-3 mx-2" />

        {/* Communities */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between text-xs uppercase text-gray-500 font-semibold tracking-wider py-1">
            Communities
            <ChevronDown className="w-4 h-4" />
          </div>

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

      {/* ⭐⭐⭐ PANEL MESSAGES — PORTAL ⭐⭐⭐ */}
      {typeof window !== "undefined" &&
        createPortal(
          <div
            className={`
              fixed top-10 left-[280px]   /* ⭐ đẹp, dịch nhẹ sang phải */
              w-80 h-[calc(100vh-4rem)]
              bg-white border-r border-gray-200 shadow-lg
              transition-all duration-300 ease-out
              ${
                openMessages
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10 pointer-events-none"
              }
              z-[999999]
            `}
          >
            <div className="p-4 font-semibold text-gray-800 border-b flex justify-between">
              Messages
              <button
                onClick={() => setOpenMessages(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="p-4 text-gray-600">
              Mini chat panel nội dung ở đây...
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
