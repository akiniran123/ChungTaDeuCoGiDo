"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// ⭐ Cho phép SidebarLeft trigger mở menu
let externalToggleNewsMenu: null | (() => void) = null;
export function toggleNewsMenu() {
  if (externalToggleNewsMenu) externalToggleNewsMenu();
}

export default function NewsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cho portal mount
  useEffect(() => setMounted(true), []);

  // ⭐ GÁN toggle gọi từ SidebarLeft
  externalToggleNewsMenu = () => {
    setOpen((prev) => {
      const newState = !prev;
      if (newState) markAllAsRead();
      return newState;
    });
  };

  // 🔹 Lấy dữ liệu thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();

    // 🔹 Realtime
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          const newNotification = payload.new as Notification | null;

          setNotifications((prev) => {
            if (!newNotification || prev.some((n) => n.id === newNotification.id))
              return prev;

            return [newNotification, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔹 Khi mở → đánh dấu đọc
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Nút chuông */}
      <button
        id="news-menu-btn"
        onClick={() => {
          const newState = !open;
          setOpen(newState);
          if (newState) markAllAsRead();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full px-[5px]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ⭐⭐ PORTAL RENDER NGOÀI BODY → KHÔNG BAO GIỜ BỊ CHE ⭐⭐ */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="
              fixed
              top-[70px]         /* chỉnh tùy theo header */
              left-[280px]       /* chỉnh tùy theo sidebar */
              w-80
              bg-white
              border border-gray-200
              rounded-2xl
              shadow-2xl
              z-[2147483647]     /* MAXIMUM z-index */
            "
          >
            <div className="p-3 font-semibold border-b">Thông báo</div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-3 text-sm text-gray-500 text-center">
                  Không có thông báo.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-sm border-b last:border-0 ${
                      n.read ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <div className="font-medium text-gray-800">{n.title}</div>

                    {n.body && (
                      <div className="text-gray-600 text-xs mt-1">
                        {n.body}
                      </div>
                    )}

                    <div className="text-gray-400 text-[11px] mt-1">
                      {n.created_at
                        ? new Date(n.created_at).toLocaleString("vi-VN")
                        : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
