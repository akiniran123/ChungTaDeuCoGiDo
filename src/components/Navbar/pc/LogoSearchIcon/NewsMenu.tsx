"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { createPortal } from "react-dom";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// cho SidebarLeft gọi
export let toggleNewsMenu: (() => void) | null = null;

export default function NewsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isClient, setIsClient] = useState(false);

  toggleNewsMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();

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

  // ⭐⭐ RENDER PANEL GIỐNG Y HỆT MESSAGES PANEL ⭐⭐
  if (!isClient) return null;

  return createPortal(
    <div
      className={`
        fixed top-[6.5rem] left-64
        w-80 h-[calc(100vh-6.5rem)]
        bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300 ease-out
        ${
          open
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10 pointer-events-none"
        }
        z-[999998]
      `}
    >
      <div className="p-4 font-semibold text-gray-800 border-b flex justify-between">
        Tin tức
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto h-full">
        {notifications.length === 0 ? (
          <p className="text-gray-500 p-4 text-sm text-center">
            Không có thông báo.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 pb-3 border-b last:border-0 text-sm"
            >
              <div className="font-medium text-gray-900">{n.title}</div>
              {n.body && (
                <div className="text-xs text-gray-600 mt-1">{n.body}</div>
              )}
              <div className="text-[10px] text-gray-400 mt-1">
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
  );
}
