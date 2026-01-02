"use client";

import React, { useCallback, useEffect, useState } from "react";
import MiniChatView from "@/components/MiniChat/MiniChatBox/MiniChatView";
import { useMiniChat } from "@/components/MiniChat/MiniChatBox/hooks/useMiniChat";
import type {
  Message as HookMessage,
  User as HookUser,
} from "@/components/MiniChat/MiniChatBox/type/types";

export type ConversationSummary = {
  partner_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_time: string;
  is_read: boolean;
};

export type MiniChatBoxProps = {
  partnerId: string;
  index?: number;
  onClose: () => void;
  onReadMessages?: () => void;
  onNewConversation?: (conv: ConversationSummary) => void;
};

// Kiểu trả về rõ ràng cho hook useMiniChat
interface MiniChatHookResult {
  currentUserId: string | null;
  partner: HookUser | null;
  messages: HookMessage[];
  loading: boolean;
  sendMessage: (content: string) => Promise<HookMessage | null>;
  markUnreadFromPartner: () => Promise<boolean>;
}

export default function MiniChatBox({
  partnerId,
  index = 0,
  onClose,
  onReadMessages,
  onNewConversation,
}: MiniChatBoxProps) {
  // Nếu useMiniChat chưa typed ở nơi khác, ép kiểu ở đây để component có kiểu rõ ràng.
  // Việc ép kiểu này không dùng `any` nên không vi phạm rule @typescript-eslint/no-explicit-any.
  const {
    currentUserId,
    partner,
    messages,
    loading,
    sendMessage,
    markUnreadFromPartner,
  } = useMiniChat(partnerId) as MiniChatHookResult;

  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    console.log("🖥️ Client local time:", now.toString());
    console.log("🕒 Client ISO:", now.toISOString());
    console.log("⏱️ Date.now():", Date.now());
  }, []);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    console.log("📨 Messages updated:", messages);

    messages.forEach((m, i) => {
      console.log(`💬 Message[${i}] raw created_at:`, m.created_at);
      if (m.created_at) {
        const d = new Date(m.created_at);
        console.log("   🕒 parsed:", d.toString());
        console.log("   🧭 ISO:", d.toISOString());
      }
    });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;

    const mark = async () => {
      if (!partnerId) return;

      try {
        const had = await markUnreadFromPartner();

        if (!cancelled && had) {
          try {
            onReadMessages?.();
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.error("❌ onReadMessages callback error:", err.message);
            } else {
              console.error("❌ onReadMessages callback error (unknown):", err);
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ markUnreadFromPartner error:", err.message);
        } else {
          console.error("❌ markUnreadFromPartner unknown error:", err);
        }
      }
    };

    const t = window.setTimeout(mark, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [partnerId, markUnreadFromPartner, onReadMessages]);

  const handleSend = useCallback(
    async (content: string): Promise<void> => {
      if (!content || content.trim().length === 0) {
        console.warn("⚠️ Attempted to send empty message, ignoring.");
        return;
      }

      console.log("➡️ Sending message:", content);

      let insertedMessage: HookMessage | null = null;

      try {
        insertedMessage = await sendMessage(content);
        console.log("✅ Inserted message:", insertedMessage);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ sendMessage error:", err.message);
        } else {
          console.error("❌ sendMessage unknown error:", err);
        }
        return;
      }

      if (insertedMessage?.created_at) {
        const d = new Date(insertedMessage.created_at);
        console.log("🕒 insertedMessage.created_at raw:", insertedMessage.created_at);
        console.log("🇻🇳 parsed local time:", d.toString());
        console.log("🧭 ISO:", d.toISOString());
      } else {
        console.warn("⚠️ insertedMessage.created_at is null");
      }

      // Nếu trước đó không có messages (lần đầu tạo conversation), gọi onNewConversation
      const hadNoMessages = !messages || messages.length === 0;

      if (hadNoMessages && partner && onNewConversation && insertedMessage) {
        try {
          const lastTime = insertedMessage.created_at ?? new Date().toISOString();

          console.log("📌 onNewConversation last_time:", lastTime);

          onNewConversation({
            partner_id: partner.id,
            username: partner.username ?? "Unknown",
            avatar_url: partner.avatar_url ?? "/default-avatar.png",
            last_message: insertedMessage.content,
            last_time: lastTime,
            is_read: true,
          });
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("❌ onNewConversation callback error:", err.message);
          } else {
            console.error("❌ onNewConversation callback error (unknown):", err);
          }
        }
      }
    },
    [sendMessage, messages, partner, onNewConversation]
  );

  return (
    <MiniChatView
      partner={partner}
      messages={messages}
      currentUserId={currentUserId}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      onSend={handleSend}
      onClose={onClose}
      index={index}
      loading={loading}
    />
  );
}