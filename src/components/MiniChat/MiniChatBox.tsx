"use client";

import React, { useEffect, useState, useCallback } from "react";
import MiniChatView from "@/components/MiniChat/MiniChatBox/MiniChatView";
import { useMiniChat } from "@/components/MiniChat/MiniChatBox/useMiniChat";

export type MiniChatBoxProps = {
  partnerId: string;
  index?: number;
  onClose: () => void;
  onReadMessages?: () => void;
  onNewConversation?: (conv: {
    partner_id: string;
    username: string;
    avatar_url: string;
    last_message: string;
    last_time: string;
    is_read: boolean;
  }) => void;
};

export default function MiniChatBox({
  partnerId,
  index = 0,
  onClose,
  onReadMessages,
  onNewConversation,
}: MiniChatBoxProps) {
  const {
    currentUserId,
    partner,
    messages,
    loading,
    sendMessage,
    markUnreadFromPartner,
  } = useMiniChat(partnerId);

  // Local optimistic fallback: nếu hook không append messages, ta dùng localMessages
  const [localMessages, setLocalMessages] = useState<any[] | null>(null);
  const [newMessage, setNewMessage] = useState("");

  /* -------------------------
   * Client time debug (1 lần)
   * ------------------------- */
  useEffect(() => {
    const now = new Date();
    console.log("🖥️ Client local time:", now.toString());
    console.log("🕒 Client ISO:", now.toISOString());
    console.log("⏱️ Date.now():", Date.now());
  }, []);

  /* -------------------------
   * Messages debug (mỗi thay đổi)
   * ------------------------- */
  useEffect(() => {
    const arr = messages ?? localMessages ?? [];
    console.log("📨 Messages source:", messages ? "hook" : localMessages ? "local" : "empty");
    console.log("📨 Messages length:", arr.length);
    if (arr.length === 0) {
      console.log("📭 No messages to display");
      return;
    }

    arr.forEach((m: any, i: number) => {
      console.log(`💬 Message[${i}] id:`, m.id ?? "(no id)", "from:", m.sender_id ?? m.from);
      console.log(`   content:`, m.content);
      console.log(`   raw created_at:`, m.created_at);
      if (m.created_at) {
        const d = new Date(m.created_at);
        console.log(`   parsed:`, d.toString());
        console.log(`   ISO:`, d.toISOString());
      } else {
        console.warn("   ⚠️ created_at missing or null for this message");
      }
    });
  }, [messages, localMessages]);

  /* -------------------------
   * Mark read once when partner ready
   * ------------------------- */
  useEffect(() => {
    let cancelled = false;

    const mark = async () => {
      if (!partnerId) return;
      try {
        const had = await markUnreadFromPartner();
        if (!cancelled && had) {
          try {
            onReadMessages?.();
          } catch (err) {
            console.error("❌ onReadMessages callback error:", err);
          }
        }
      } catch (err) {
        console.error("❌ markUnreadFromPartner error:", err);
      }
    };

    const t = window.setTimeout(mark, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [partnerId, markUnreadFromPartner, onReadMessages]);

  /* -------------------------
   * Send message (with try/catch, clear input, optimistic append)
   * ------------------------- */
  const handleSend = useCallback(
    async (content: string): Promise<void> => {
      if (!content || content.trim() === "") {
        console.warn("✋ Attempt to send empty message ignored");
        return;
      }

      console.log("➡️ Sending message:", content);

      // optimistic local append: tạo object tạm để hiển thị ngay
      const optimistic = {
        id: `optimistic-${Date.now()}`,
        content,
        sender_id: currentUserId,
        created_at: new Date().toISOString(),
        optimistic: true,
      };

      // Nếu hook không cập nhật messages ngay, dùng localMessages làm fallback
      setLocalMessages((prev) => {
        const base = messages ?? prev ?? [];
        return [...base, optimistic];
      });

      try {
        const insertedMessage = await sendMessage(content);
        console.log("✅ Inserted message:", insertedMessage);

        if (insertedMessage?.created_at) {
          const d = new Date(insertedMessage.created_at);
          console.log("🕒 insertedMessage.created_at raw:", insertedMessage.created_at);
          console.log("🇻🇳 parsed local time:", d.toString());
          console.log("🧭 ISO:", d.toISOString());
        } else {
          console.warn("⚠️ insertedMessage.created_at is null");
        }

        // Nếu hook không tự cập nhật messages, replace optimistic bằng inserted
        setLocalMessages((prev) => {
          if (!prev) return null;
          return prev.map((m) => (m.id === optimistic.id ? insertedMessage : m));
        });

        // clear input
        setNewMessage("");

        // first message → notify parent
        const currentMessagesLength = (messages ?? localMessages ?? []).length;
        if (currentMessagesLength === 0 && partner && onNewConversation && insertedMessage) {
          try {
            const lastTime = insertedMessage.created_at ?? new Date().toISOString();
            console.log("📌 onNewConversation last_time:", lastTime);
            onNewConversation({
              partner_id: partner.id,
              username: partner.username || "Unknown",
              avatar_url: partner.avatar_url || "/default-avatar.png",
              last_message: insertedMessage.content,
              last_time: lastTime,
              is_read: true,
            });
          } catch (err) {
            console.error("❌ onNewConversation callback error:", err);
          }
        }
      } catch (err) {
        console.error("❌ sendMessage failed:", err);
        // giữ optimistic message nhưng gắn flag lỗi để UI hiển thị trạng thái
        setLocalMessages((prev) =>
          prev ? prev.map((m) => (m.id === optimistic.id ? { ...m, error: true } : m)) : prev
        );
      }
    },
    [sendMessage, messages, localMessages, currentUserId, partner, onNewConversation]
  );

  /* -------------------------
   * Prepare messages to pass to MiniChatView
   * - ưu tiên hook messages; nếu không có thì dùng localMessages
   * - sort theo created_at tăng dần
   * ------------------------- */
  const merged = (messages ?? localMessages ?? []).slice();
  const safeSorted = merged.sort((a: any, b: any) => {
    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return ta - tb;
  });

  return (
    <MiniChatView
      partner={partner}
      messages={safeSorted}
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