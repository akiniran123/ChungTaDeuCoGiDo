"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export type Notification = {
  id: string;
  title: string;
  body: string | null;
  data: any;
  read: boolean;
  created_at: string;
};

type NewsPanelProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NewsPanel({ open, setOpen }: NewsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return; // Chỉ fetch khi panel mở

    async function fetchNotifications() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, title, body, data, read, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Lỗi khi fetch notifications:", error);
          setNotifications([]);
        } else if (data) {
          setNotifications(
            data.map((n) => ({
              id: n.id,
              title: n.title,
              body: n.body ?? null,
              data: n.data ?? null,
              read: n.read ?? false,
              created_at: n.created_at ?? new Date().toISOString(),
            }))
          );
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [open]);

  return createPortal(
    <div
      className={`
        fixed top-[6.5rem] left-64
        w-80 h-[calc(100vh-6.5rem)]
        bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300
        ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}
        z-[999999]
      `}
    >
      {/* Header */}
      <div className="p-4 font-semibold flex justify-between">
        Thông báo
        <button onClick={() => setOpen(false)}>
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Nội dung */}
      <div className="overflow-y-auto h-full">
        {loading ? (
          <p className="text-sm text-gray-500 p-4">Đang tải...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">Chưa có thông báo mới.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded mb-2 ${n.read ? "" : "font-medium"}`}
            >
              <p className="font-medium text-gray-900">{n.title}</p>
              {n.body && <p className="text-gray-700 mt-1">{n.body}</p>}
              <p className="text-[11px] text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  );
}
