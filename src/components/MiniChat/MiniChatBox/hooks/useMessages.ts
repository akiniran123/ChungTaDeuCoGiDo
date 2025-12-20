"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Message } from "@/components/MiniChat/MiniChatBox/type/types";
import { buildOrFilter, normalizeMessage } from "@/components/MiniChat/MiniChatBox/util/utils";

export function useMessages(
  currentUserId: string | null,
  partnerId: string | null
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 🔴 VÁ: reset messages khi đổi partner (giống bản gốc)
  useEffect(() => {
    if (currentUserId && partnerId) {
      setMessages([]);
      setLoading(true);
    }
  }, [currentUserId, partnerId]);

  const fetchMessages = useCallback(async () => {
    if (!currentUserId || !partnerId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(buildOrFilter(currentUserId, partnerId))
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (mountedRef.current) {
        setMessages((data ?? []).map(normalizeMessage));
      }
    } catch (err) {
      console.error("[useMessages] fetch error:", err);
      if (mountedRef.current) setMessages([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [currentUserId, partnerId]);

  // 🔴 VÁ: markUnreadFromPartner (API gốc)
  const markUnreadFromPartner = useCallback(async () => {
    if (!currentUserId || !partnerId) return false;

    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);

      if (error) {
        console.error("[useMessages] markUnread error:", error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error("[useMessages] markUnread exception:", err);
      return false;
    }
  }, [currentUserId, partnerId]);

  return {
    messages,
    loading,
    setMessages,
    fetchMessages,
    markUnreadFromPartner,
  };
}
