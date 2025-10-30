"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function TinTucPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string>("");

  // 🔹 Lấy user hiện tại
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, []);

  // 🔹 Lấy danh sách thông báo
  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi khi lấy notifications:", error.message);
      } else {
        setNotifications(data || []);
      }
    }

    fetchNotifications();

    // 🔹 Lắng nghe realtime khi có thông báo mới
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newItem = payload.new as Notification;
          if (newItem.user_id === userId) {
            setNotifications((prev) => [newItem, ...prev]);

            // 🔔 Nếu trình duyệt cho phép, hiển thị thông báo popup
            if (Notification.permission === "granted") {
              new Notification(newItem.title || "Tin mới", {
                body: newItem.body || "",
                icon: "/icon.png",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Tin tức</h1>
      <p className="mt-2 text-gray-600">Thông tin và cập nhật mới nhất.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {notifications.length === 0 && (
          <p className="text-gray-500">Chưa có thông báo nào.</p>
        )}

        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={`/tin-tuc/${notification.id}`}
            className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition p-4"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {notification.title}
            </h2>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {notification.body}
            </p>
            <div className="text-xs text-gray-400 mt-1">
              {notification.created_at
                ? new Date(notification.created_at).toLocaleString("vi-VN")
                : "Chưa có thời gian"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
