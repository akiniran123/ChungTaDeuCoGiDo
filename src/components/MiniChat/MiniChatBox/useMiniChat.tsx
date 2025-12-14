// src/components/MiniChat/useMiniChat.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface User {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string | null;
  type: string | null;
  is_read: boolean | null;
}

export function useMiniChat(partnerId: string | null) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(false);
  const messagesLoadedRef = useRef(false);
  const readDebounceTimer = useRef<number | null>(null);
  const newConvDebounceTimer = useRef<number | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (readDebounceTimer.current) window.clearTimeout(readDebounceTimer.current);
      if (newConvDebounceTimer.current) window.clearTimeout(newConvDebounceTimer.current);
      if (subscriptionRef.current) {
        try {
          supabase.removeChannel(subscriptionRef.current);
        } catch (err) {
          console.error("removeChannel error:", err);
        }
        subscriptionRef.current = null;
      }
    };
  }, []);

  // fetch current user id
  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!cancelled && data?.user) setCurrentUserId(data.user.id);
      } catch (err) {
        console.error("fetchUser error:", err);
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  // fetch partner info
  useEffect(() => {
    if (!partnerId) {
      setPartner(null);
      return;
    }
    let cancelled = false;
    const fetchPartner = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .eq("id", partnerId)
          .single();
        if (error) throw error;
        if (!cancelled) setPartner(data as User);
      } catch (err) {
        console.error("fetchPartner error:", err);
      }
    };
    fetchPartner();
    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  // fetch messages + subscribe realtime
  useEffect(() => {
    if (!currentUserId || !partnerId) return;
    if (messagesLoadedRef.current) return;
    messagesLoadedRef.current = true;
    setLoading(true);

    let channelRef: any = null;
    const fetchMessages = async () => {
      try {
        const { data: sentMsgs } = await supabase
          .from("messages")
          .select("*")
          .eq("sender_id", currentUserId)
          .eq("receiver_id", partnerId);

        const { data: recvMsgs } = await supabase
          .from("messages")
          .select("*")
          .eq("sender_id", partnerId)
          .eq("receiver_id", currentUserId);

        const all = [...(sentMsgs ?? []), ...(recvMsgs ?? [])] as Message[];
        all.sort((a, b) => new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime());
        if (mountedRef.current) setMessages(all);
      } catch (err) {
        console.error("fetchMessages error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchMessages();

    try {
      channelRef = supabase
        .channel(`mini-chat-${currentUserId}-${partnerId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          async (payload) => {
            try {
              const msg = payload.new as Message;
              const isRelated =
                (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
                (msg.sender_id === partnerId && msg.receiver_id === currentUserId);
              if (!isRelated) return;
              if (mountedRef.current) setMessages((prev) => [...prev, msg]);

              if (msg.sender_id === partnerId) {
                try {
                  await supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
                } catch (err) {
                  console.error("update is_read error:", err);
                }
                // debounce mark read callback handled by consumer
              }
            } catch (err) {
              console.error("realtime handler error:", err);
            }
          }
        )
        .subscribe();

      subscriptionRef.current = channelRef;
    } catch (err) {
      console.error("subscribe error:", err);
    }

    return () => {
      if (channelRef) {
        try {
          supabase.removeChannel(channelRef);
        } catch (err) {
          console.error("removeChannel error:", err);
        }
      }
      subscriptionRef.current = null;
      messagesLoadedRef.current = false;
    };
  }, [currentUserId, partnerId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentUserId || !partnerId || !content.trim()) return null;
      try {
        const payload = {
          sender_id: currentUserId,
          receiver_id: partnerId,
          content: content.trim(),
          is_read: false,
        };
        await supabase.from("messages").insert(payload);
        return payload;
      } catch (err) {
        console.error("sendMessage error:", err);
        return null;
      }
    },
    [currentUserId, partnerId]
  );

  const markUnreadFromPartner = useCallback(async () => {
    if (!currentUserId || !partnerId) return;
    try {
      const { data: unread } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false)
        .limit(1);

      if (!unread || (Array.isArray(unread) && unread.length === 0)) return false;

      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);

      return true;
    } catch (err) {
      console.error("markUnreadFromPartner error:", err);
      return false;
    }
  }, [currentUserId, partnerId]);

  return {
    currentUserId,
    partner,
    messages,
    loading,
    sendMessage,
    markUnreadFromPartner,
    setMessages,
  };
}