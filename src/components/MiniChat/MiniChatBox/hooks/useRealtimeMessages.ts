"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Message } from "@/components/MiniChat/MiniChatBox/type/types";
import { normalizeMessage } from "@/components/MiniChat/MiniChatBox/util/utils";

export function useRealtimeMessages(
  currentUserId: string | null,
  partnerId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const mountedRef = useRef(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const channel = supabase
      .channel(`mini-chat-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!mountedRef.current) return;

          const msg = normalizeMessage(payload.new);

          const isRelated =
            (msg.sender_id === currentUserId &&
              msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId &&
              msg.receiver_id === currentUserId);

          if (!isRelated) return;

          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );

          if (msg.sender_id === partnerId) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", msg.id);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUserId, partnerId, setMessages]);
}
