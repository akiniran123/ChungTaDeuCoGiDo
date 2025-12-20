"use client";

import { useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { usePartner } from "./usePartner";
import { useMessages } from "./useMessages";
import { useRealtimeMessages } from "./useRealtimeMessages";
import { Message } from "@/components/MiniChat/MiniChatBox/type/types";

export function useMiniChat(partnerId: string | null) {
  const currentUserId = useCurrentUser();
  const partner = usePartner(partnerId);

  const {
    messages,
    loading,
    setMessages,
    fetchMessages,
    markUnreadFromPartner,
  } = useMessages(currentUserId, partnerId);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useRealtimeMessages(currentUserId, partnerId, setMessages);

  const sendMessage = useCallback(
    async (content: string): Promise<Message | null> => {
      if (!currentUserId || !partnerId || !content.trim()) return null;

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: partnerId,
          content: content.trim(),
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error("[useMiniChat] sendMessage error:", error);
        return null;
      }

      return data as Message;
    },
    [currentUserId, partnerId]
  );

  return {
    currentUserId,
    partner,
    messages,
    loading,
    sendMessage,
    markUnreadFromPartner, // ✅ PHỤC HỒI
    setMessages,
    refetchMessages: fetchMessages,
  };
}
