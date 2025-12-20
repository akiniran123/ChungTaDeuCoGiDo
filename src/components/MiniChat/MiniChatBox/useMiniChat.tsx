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
  // optional flags for UI/testing (not persisted)
  optimistic?: boolean;
  error?: boolean;
}

export function useMiniChat(partnerId: string | null) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(false);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  // mount / unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
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
        console.log("[useMiniChat] fetchUser start");
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("[useMiniChat] getUser error:", error);
          return;
        }
        if (!cancelled && data?.user) {
          console.log("[useMiniChat] currentUserId:", data.user.id);
          setCurrentUserId(data.user.id);
        } else {
          console.log("[useMiniChat] no user returned");
        }
      } catch (err) {
        console.error("fetchUser exception:", err);
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
        console.log("[useMiniChat] fetchPartner id=", partnerId);
        const { data, error } = await supabase
          .from("users")
          .select("id, username, avatar_url")
          .eq("id", partnerId)
          .single();

        if (error) {
          console.error("[useMiniChat] fetchPartner error:", error);
          return;
        }
        if (!cancelled) {
          setPartner(data as User);
          console.log("[useMiniChat] partner loaded:", data);
        }
      } catch (err) {
        console.error("fetchPartner exception:", err);
      }
    };

    fetchPartner();
    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  // fetch + realtime
  useEffect(() => {
    if (!currentUserId || !partnerId) {
      console.log("[useMiniChat] skip fetchMessages: currentUserId or partnerId missing", {
        currentUserId,
        partnerId,
      });
      return;
    }

    setLoading(true);
    setMessages([]);

    let channel: RealtimeChannel | null = null;

    const fetchMessages = async () => {
      try {
        // build filter string without newline or extra spaces
        const orFilter = `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`;
        console.log("[useMiniChat] fetchMessages orFilter:", orFilter);

        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(orFilter)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("[useMiniChat] fetchMessages supabase error:", error);
          // set empty so UI shows "no messages" instead of null
          if (mountedRef.current) setMessages([]);
          return;
        }

        console.log("[useMiniChat] 📩 fetched messages:", data);
        if (mountedRef.current) {
          setMessages((data as Message[] | null) ?? []);
        }
      } catch (err) {
        console.error("[useMiniChat] fetchMessages exception:", err);
        if (mountedRef.current) setMessages([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchMessages();

    // realtime subscription
    channel = supabase
      .channel(`mini-chat-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: RealtimePostgresChangesPayload<Message>) => {
          try {
            const msg = payload.new as Message;
            console.log("[useMiniChat] realtime payload:", payload);

            const isRelated =
              (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
              (msg.sender_id === partnerId && msg.receiver_id === currentUserId);

            if (!isRelated) {
              console.log("[useMiniChat] realtime msg not related, ignore", msg);
              return;
            }

            if (mountedRef.current) {
              setMessages((prev) => {
                // avoid duplicate if same id exists
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
            }

            // mark read if partner sent it
            if (msg.sender_id === partnerId) {
              try {
                const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
                if (error) console.error("[useMiniChat] update is_read error:", error);
              } catch (err: unknown) {
                console.error("[useMiniChat] update is_read exception:", err);
              }
            }
          } catch (err) {
            console.error("[useMiniChat] realtime handler exception:", err);
          }
        }
      )
      .subscribe((status) => {
        console.log("[useMiniChat] realtime subscribe status:", status);
      });

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
      if (!currentUserId || !partnerId || !content.trim()) {
        console.warn("[useMiniChat] sendMessage aborted, missing data", { currentUserId, partnerId, content });
        return null;
      }

      try {
        // optional: optimistic append (uncomment if you want immediate UI feedback)
        // const optimistic: Message = {
        //   id: `optimistic-${Date.now()}`,
        //   sender_id: currentUserId,
        //   receiver_id: partnerId,
        //   content: content.trim(),
        //   created_at: new Date().toISOString(),
        //   type: null,
        //   is_read: false,
        //   optimistic: true,
        // };
        // setMessages(prev => [...prev, optimistic]);

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
          console.error("[useMiniChat] sendMessage supabase error:", error);
          return null;
        }

        console.log("[useMiniChat] sendMessage inserted:", data);
        // If realtime doesn't arrive quickly, you can append here:
        // setMessages(prev => [...prev, data as Message]);

        return data as Message;
      } catch (err) {
        console.error("[useMiniChat] sendMessage exception:", err);
        return null;
      }
    },
    [currentUserId, partnerId]
  );

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
        console.error("[useMiniChat] markUnreadFromPartner supabase error:", error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error("markUnreadFromPartner exception:", err);
      return false;
    }
  }, [currentUserId, partnerId]);

  // expose a manual refetch for debugging
  const refetchMessages = useCallback(async () => {
    if (!currentUserId || !partnerId) {
      console.warn("[useMiniChat] refetchMessages aborted, missing ids", { currentUserId, partnerId });
      return;
    }
    setLoading(true);
    try {
      const orFilter = `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`;
      console.log("[useMiniChat] manual refetch orFilter:", orFilter);
      const { data, error } = await supabase.from("messages").select("*").or(orFilter).order("created_at", { ascending: true });
      if (error) {
        console.error("[useMiniChat] manual refetch error:", error);
        setMessages([]);
        return;
      }
      console.log("[useMiniChat] manual refetch data:", data);
      setMessages((data as Message[] | null) ?? []);
    } catch (err) {
      console.error("[useMiniChat] manual refetch exception:", err);
      setMessages([]);
    } finally {
      setLoading(false);
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
    refetchMessages, // for manual testing
  };
}