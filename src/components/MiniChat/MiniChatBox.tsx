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

  const [newMessage, setNewMessage] = useState("");

  /* --------------------------------------------------
   * 🧭 DEBUG: kiểm tra giờ client (CHỈ CHẠY 1 LẦN)
   * -------------------------------------------------- */
  useEffect(() => {
    const now = new Date();
    console.log("🖥️ Client local time:", now.toString());
    console.log("🕒 Client ISO:", now.toISOString());
    console.log("⏱️ Date.now():", Date.now());
  }, []);

  /* --------------------------------------------------
   * 📩 DEBUG: log messages mỗi khi thay đổi
   * -------------------------------------------------- */
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    console.log("📨 Messages updated:", messages);

    messages.forEach((m, i) => {
      console.log(`💬 Message[${i}] raw created_at:`, m.created_at);
      if (m.created_at) {
        const d = new Date(m.created_at);
        console.log(`   🕒 parsed:`, d.toString());
        console.log(`   🧭 ISO:`, d.toISOString());
      }
    });
  }, [messages]);

  /* --------------------------------------------------
   * 👁️ mark read once when partner ready
   * -------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const mark = async () => {
      if (!partnerId) return;

      const had = await markUnreadFromPartner();

      if (!cancelled && had) {
        try {
          onReadMessages?.();
        } catch (err) {
          console.error("❌ onReadMessages callback error:", err);
        }
      }
    };

    const t = window.setTimeout(mark, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [partnerId, markUnreadFromPartner, onReadMessages]);

  /* --------------------------------------------------
   * ✉️ Send message
   * -------------------------------------------------- */
  const handleSend = useCallback(
    async (content: string): Promise<void> => {
      console.log("➡️ Sending message:", content);

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

      // first message → notify parent
      if (
        messages.length === 0 &&
        partner &&
        onNewConversation &&
        insertedMessage
      ) {
        try {
          const lastTime =
            insertedMessage.created_at ?? new Date().toISOString();

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
    },
    [sendMessage, messages.length, partner, onNewConversation]
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
