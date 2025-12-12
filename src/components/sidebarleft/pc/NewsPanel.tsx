"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

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

  // Fetch + realtime
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

  if (!isClient) return null;

  return createPortal(
    <div
      className={`
        fixed top-[6.5rem] left-64
        w-80 h-[calc(100vh-6.5rem)]
        bg-white shadow-lg
        transition-all duration-300
        ${
          open
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10 pointer-events-none"
        }
        z-[999998]
      `}
    >
      {/* HEADER */}
      <div className="p-4 font-semibold text-gray-800 flex justify-between">
        Thông báo
        <button
          onClick={() => {
            setOpen(false);
            setActivePanel(null);
          }}
          className="text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* LIST */}
      <div className="overflow-y-auto h-full">
        {notifications.length === 0 ? (
          <p className="text-gray-500 p-4 text-sm text-center">
            Không có thông báo.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setOpen(false);
                setActivePanel(null);
                router.push(`/notifications/${n.id}`);
              }}
              className="p-4 text-sm cursor-pointer hover:bg-gray-100 transition"
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
