"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { Message } from "@/components/MiniChat/MiniChatBox/type/types";
import { normalizeMessage } from "@/components/MiniChat/MiniChatBox/util/utils";

/**
 * Subscribe to realtime INSERT events on messages table and append normalized messages.
 * - Avoids `any` by using proper supabase types.
 * - Normalizes incoming payloads to the shared Message type.
 */
export function useRealtimeMessages(
  currentUserId: string | null,
  partnerId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const mountedRef = useRef<boolean>(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

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
        async (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          if (!mountedRef.current) return;

          // Normalize raw payload into our Message type
          const msg = normalizeMessage(payload.new);

          const isRelated =
            (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === currentUserId);

          if (!isRelated) return;

          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));

          if (msg.sender_id === partnerId) {
            // mark as read on server (best-effort)
            await supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error("removeChannel error:", err);
        }
        channelRef.current = null;
      }
    };
  }, [currentUserId, partnerId, setMessages]);
}