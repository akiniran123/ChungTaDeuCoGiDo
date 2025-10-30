"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function NewsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // 🔹 Lấy user hiện tại
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  // 🔹 Lấy danh sách thông báo từ Supabase
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) setNotifications(data);
    };

    fetchNotifications();

    // 🔹 Lắng nghe realtime khi có thông báo mới
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          // Ép kiểu rõ ràng để tránh lỗi TS
          const newNotification = payload.new as Notification | null;

          if (
            newNotification &&
            newNotification.user_id === userId &&
            !notifications.find((n) => n.id === newNotification.id)
          ) {
            setNotifications((prev) => [newNotification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, notifications]);

  // 🔹 Đánh dấu đã đọc khi mở menu
  const markAllAsRead = async () => {
    if (!userId) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Nút chuông thông báo */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) markAllAsRead();
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

      {/* Danh sách thông báo (dropdown) */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
          <div className="p-3 font-semibold border-b">Thông báo</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-sm text-gray-500 text-center">
                Không có thông báo nào.
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
                    <div className="text-gray-600 text-xs mt-1">{n.body}</div>
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
        </div>
      )}
    </div>
  );
}
