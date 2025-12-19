"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

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
  const readDebounceTimer = useRef<number | null>(null);
  const newConvDebounceTimer = useRef<number | null>(null);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  // mount / unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (readDebounceTimer.current)
        window.clearTimeout(readDebounceTimer.current);
      if (newConvDebounceTimer.current)
        window.clearTimeout(newConvDebounceTimer.current);
      if (subscriptionRef.current) {
        try {
          supabase.removeChannel(subscriptionRef.current);
        } catch (err) {
          console.error("removeChannel error:", err);
        }
      }
      subscriptionRef.current = null;
    };
  }, []);

  // fetch current user
  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!cancelled && data?.user) {
          setCurrentUserId(data.user.id);
        }
      } catch (err) {
        console.error("fetchUser error:", err);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  // fetch partner
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

  // 🔥 FETCH + REALTIME (FIX CHUẨN)
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    setLoading(true);
    setMessages([]);

    let channel: RealtimeChannel | null = null;

    const fetchMessages = async () => {
      try {
        const { data } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),
             and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`
          )
          .order("created_at", { ascending: true });

        console.log("📩 fetched messages:", data);

        if (mountedRef.current && data) {
          setMessages(data as Message[]);
        }
      } catch (err) {
        console.error("fetchMessages error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchMessages();

    channel = supabase
      .channel(`mini-chat-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: RealtimePostgresChangesPayload<Message>) => {
          const msg = payload.new as Message;

          const isRelated =
            (msg.sender_id === currentUserId &&
              msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId &&
              msg.receiver_id === currentUserId);

          if (!isRelated) return;

          console.log("⚡ realtime msg:", msg);

          if (mountedRef.current) {
            setMessages((prev) => [...prev, msg]);
          }

          // ✅ FIX ĐÚNG SUPABASE + TYPESCRIPT
          if (msg.sender_id === partnerId) {
            try {
              const { error } = await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", msg.id);

              if (error) {
                console.error("update is_read error:", error);
              }
            } catch (err: unknown) {
              console.error("update is_read exception:", err);
            }
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.error("removeChannel error:", err);
        }
      }
      subscriptionRef.current = null;
    };
  }, [currentUserId, partnerId]);

  // send message
  const sendMessage = useCallback(
    async (content: string): Promise<Message | null> => {
      if (!currentUserId || !partnerId || !content.trim()) return null;

      try {
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

        if (error) throw error;

        return data as Message;
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
      const { data } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);

      return !!data;
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
