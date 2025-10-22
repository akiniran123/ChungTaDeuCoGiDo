"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { useParams } from "next/navigation";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationDetail() {
  const params = useParams();
  const slugParam = params.slug;

  // Kiểm tra slug tồn tại và là string
  if (!slugParam || Array.isArray(slugParam)) {
    return <div className="p-4 text-red-500">Slug không hợp lệ</div>;
  }

  const slug: string = slugParam;

  const [notification, setNotification] = useState<NotificationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotification() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("id", slug)
        .single();

      if (error) {
        console.error("Lỗi khi lấy chi tiết:", error.message);
        setError(error.message);
      } else {
        setNotification(data);
      }
      setLoading(false);
    }

    fetchNotification();
  }, [slug]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!notification) return <div className="p-4">Không tìm thấy thông báo.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{notification.title}</h1>
      <p className="mb-4">{notification.body}</p>
      <div className="text-sm text-gray-400">Ngày: {notification.created_at}</div>
      <div className="text-sm text-gray-400">Đã đọc: {notification.read ? "✅" : "❌"}</div>
    </div>
  );
}
