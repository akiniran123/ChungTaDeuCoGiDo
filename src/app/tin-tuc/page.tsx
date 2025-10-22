"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationData = { image_url?: string }; // kiểu object dự kiến trong data

export default function TinTucPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, []);

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
        setNotifications(data);
      }
    }

    fetchNotifications();
  }, [userId]);

  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Tin tức</h1>
      <p className="mt-2 text-gray-600">Thông tin và cập nhật mới nhất.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {notifications.length === 0 && <p>Chưa có thông báo nào.</p>}

        {notifications.map((notification) => {
          // Lấy image_url từ data nếu có
          let imageUrl: string | undefined;
          if (
            notification.data &&
            typeof notification.data === "object" &&
            !Array.isArray(notification.data)
          ) {
            imageUrl = (notification.data as NotificationData).image_url;
          }

          return (
            <Link
              key={notification.id}
              href={`/tin-tuc/${notification.id}`}
              className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              {imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={imageUrl}
                    alt={notification.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h2>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {notification.body}
                </p>
                <div className="text-xs text-gray-400 mt-1">{notification.created_at}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
