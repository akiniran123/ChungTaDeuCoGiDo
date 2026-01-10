"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Bell } from "lucide-react"; // Thêm icon cho sinh động

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

type NewsMenuProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activePanel: string | null;
  setActivePanel: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function NewsMenu({
  open,
  setOpen,
  activePanel,
  setActivePanel,
}: NewsMenuProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch + realtime (Giữ nguyên logic của bạn)
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi khi lấy notifications:", error);
        setNotifications([]);
        return;
      }
      setNotifications((data ?? []) as Notification[]);
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

  if (!isClient) return null;

  // CẬP NHẬT PANEL CLASS: Full mobile, trượt từ dưới lên hoặc từ trái qua
  const panelClass = `
    fixed inset-0 z-[999999] 
    md:inset-auto md:top-[6.5rem] md:left-64 md:w-80 md:h-[calc(100vh-6.5rem)] 
    bg-white border-r border-gray-200 shadow-2xl md:shadow-lg 
    transition-all duration-300 transform
    ${open 
      ? "translate-x-0 opacity-100" 
      : "-translate-x-full md:-translate-x-10 opacity-0 pointer-events-none"}
  `;

  return createPortal(
    <div className={panelClass}>
      {/* HEADER: Đồng bộ với MessagesPanel */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 md:bg-white pt-safe">
        <h2 className="text-xl md:text-lg font-bold">Thông báo</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => {
            setOpen(false);
            setActivePanel(null);
          }}
        >
          <X size={24} className="md:w-5 md:h-5 text-gray-600" />
        </button>
      </div>

      {/* LIST CONTENT */}
      <div className="overflow-y-auto h-[calc(100vh-5rem)] md:h-[calc(100vh-11rem)] pb-24 md:pb-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell size={48} className="mb-2 opacity-20" />
            <p className="text-sm">Không có thông báo.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setOpen(false);
                setActivePanel(null);
                router.push(`/notifications/${n.id}`);
              }}
              className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="font-semibold text-gray-900 text-base md:text-sm">{n.title}</div>

              {n.body && (
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{n.body}</div>
              )}

              <div className="text-[10px] text-gray-400 mt-2 flex justify-end">
                {n.created_at
                  ? new Date(n.created_at).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
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