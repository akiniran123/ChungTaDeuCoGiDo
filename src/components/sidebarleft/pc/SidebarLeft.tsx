"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  Plus,
  Users,
  Star,
  ChevronDown,
  MessageSquare,
  Newspaper,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import MessagesMenu from "@/components/Navbar/pc/LogoSearchIcon/MessagesMenu";

import { toggleNewsMenu } from "@/components/Navbar/pc/LogoSearchIcon/NewsMenu";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import MiniChatBox from "@/app/MiniChat/MiniChatBox";

export default function SidebarLeft() {
  const router = useRouter();

  const [communities, setCommunities] = useState<
    { id: string; title: string | null; avatar_url: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [openMessages, setOpenMessages] = useState(false);

  const [isClient, setIsClient] = useState(false);

  const [conversations, setConversations] = useState<
    {
      partner_id: string;
      username: string | null;
      avatar_url: string | null;
      last_message: string | null;
      last_time: string | null;
    }[]
  >([]);

  const [openMiniChat, setOpenMiniChat] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

        // Chỉnh lại query: lấy avatar_url từ communities
        const { data, error } = await supabase
          .from("community_members")
          .select(`
            community_id,
            communities (
              id,
              title,
              avatar_url
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

  useEffect(() => {
    if (!userId) return;

    async function loadConversations() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Lỗi tải tin nhắn:", error);
        return;
      }

      const map = new Map();

      data.forEach((msg) => {
        const partner =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

        if (!map.has(partner)) {
          map.set(partner, {
            last_message: msg.content,
            last_time: msg.created_at,
          });
        }
      });

      const partnerIds = [...map.keys()];

      if (partnerIds.length === 0) {
        setConversations([]);
        return;
      }

      const { data: usersList, error: userErr } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .in("id", partnerIds);

      if (userErr) {
        console.error("❌ Lỗi tải users:", userErr);
        return;
      }

      const final = partnerIds.map((pid) => {
        const u = usersList?.find((x) => x.id === pid);
        const info = map.get(pid);
        return {
          partner_id: pid,
          username: u?.username || "Unknown",
          avatar_url: u?.avatar_url || "/default-avatar.png",
          last_message: info.last_message,
          last_time: info.last_time,
        };
      });

      setConversations(final);
    }

    loadConversations();
  }, [userId]);

  const handleRequireLogin = () => {
    alert("Bạn cần đăng nhập trước!");
  };

  const handleStartSelling = () => {
    if (userId) router.push("/protected/sell");
    else handleRequireLogin();
  };

  return (
    <>
      <aside
        className="
          fixed top-[6.5rem] left-0
          w-64 h-[calc(100vh-6.5rem)]
          bg-white border-r border-gray-200 
          overflow-y-visible text-gray-900 z-40 shadow-sm
          transition-transform duration-300
          translate-x-0
        "
      >
        <nav className="mt-4 space-y-1">

          {/* ⭐ Trang chủ */}
          <Link
            href="/"
            className="flex items-center gap-4 px-5 py-3 text-base font-medium text-gray-900 rounded-xl mx-2 hover:bg-gray-100"
          >
            <Home className="w-6 h-6 text-gray-700" />
            <span className="text-gray-900">Trang chủ</span>
          </Link>

          {/* ⭐ Khám phá */}
          <Link
            href="/communities"
            className="flex items-center gap-4 px-5 py-3 text-base font-medium text-gray-900 rounded-xl mx-2 hover:bg-gray-100"
          >
            <Compass className="w-6 h-6 text-gray-700" />
            <span className="text-gray-900">Khám phá</span>
          </Link>

          {/* Tin nhắn */}
          <div
            onClick={() => setOpenMessages(!openMessages)}
            className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <span className="text-base font-medium text-gray-900">
              Tin nhắn
            </span>

            <MessagesMenu />
          </div>

          {/* Bán hàng */}
          <div
            onClick={handleStartSelling}
            className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            <span className="text-base font-medium text-gray-900">
              Bán hàng
            </span>
          </div>

          {/* Tin tức */}
          <div
            className="flex items-center gap-4 px-5 py-3 mx-2 rounded-xl hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleNewsMenu?.()}
          >
            <Newspaper className="w-6 h-6 text-gray-700" />
            <span className="text-base font-medium text-gray-900">Thông báo</span>
          </div>
        </nav>

        <hr className="border-gray-200 my-3 mx-2" />

        <div className="px-4 mb-6">
          <div className="flex items-center justify-between text-xs uppercase text-gray-500 font-semibold tracking-wider py-1">
            Cộng đồng
            <ChevronDown className="w-4 h-4" />
          </div>

          {/* ⭐ Tạo cộng đồng */}
          <Link
            href="/create-community"
            className="flex items-center gap-2 px-2 py-1.5 text-base font-medium text-gray-900 rounded hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">Tạo cộng đồng</span>
          </Link>

          {/* ⭐ Quản lý cộng đồng */}
          <Link
            href="/manage-communities"
            className="flex items-center gap-2 px-2 py-1.5 text-base font-medium text-gray-900 rounded hover:bg-gray-100"
          >
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">Quản lý cộng đồng</span>
          </Link>

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
                  className="flex items-center gap-2 px-2 py-1.5 text-base font-medium text-gray-900 rounded hover:bg-gray-100"
                >
                  <img
                    src={c.avatar_url || "/default-community.png"}
                    alt={c.title || "community"}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="truncate text-gray-900">{c.title || "Không tên"}</span>
                  <Star className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* PANEL MESSAGES */}
      {isClient &&
        createPortal(
          <div
            className={`
              fixed top-[6.5rem] left-64
              w-80 h-[calc(100vh-6.5rem)]
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
            <div className="p-4 font-semibold text-gray-800 flex justify-between">
              Tin nhắn
              <button
                onClick={() => setOpenMessages(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <p className="text-gray-500 p-4 text-sm">
                  Bạn chưa có cuộc trò chuyện nào.
                </p>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.partner_id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedPartner(c.partner_id);
                      setOpenMiniChat(true);
                    }}
                  >
                    <img
                      src={c.avatar_url || "/default-avatar.png"}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {c.username}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {c.last_message}
                      </p>
                    </div>

                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {c.last_time
                        ? new Date(c.last_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}

      {openMiniChat && selectedPartner && (
        <MiniChatBox
          partnerId={selectedPartner}
          onClose={() => setOpenMiniChat(false)}
        />
      )}
    </>
  );
}
