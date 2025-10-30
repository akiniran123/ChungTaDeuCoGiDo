"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { useParams } from "next/navigation";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationDetail() {
  const params = useParams();
  const slugParam = params.slug;

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

        // 🔹 Cập nhật trạng thái đã đọc
        if (!data.read) {
          await supabase.from("notifications").update({ read: true }).eq("id", slug);
        }
      }
      setLoading(false);
    }

    fetchNotification();
  }, [slug]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!notification) return <div className="p-4">Không tìm thấy thông báo.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">{notification.title || "Không có tiêu đề"}</h1>
      <p className="text-gray-700 mb-4 whitespace-pre-line">
        {notification.body || "Không có nội dung"}
      </p>
      <div className="text-sm text-gray-500">
        Ngày:{" "}
        {notification.created_at
          ? new Date(notification.created_at).toLocaleString("vi-VN")
          : "Không rõ ngày"}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        Trạng thái: {notification.read ? "✅ Đã đọc" : "❌ Chưa đọc"}
      </div>
    </div>
  );
}
