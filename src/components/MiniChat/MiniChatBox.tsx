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
  const { currentUserId, partner, messages, loading, sendMessage, markUnreadFromPartner } =
    useMiniChat(partnerId);
  const [newMessage, setNewMessage] = useState("");

  // mark read once when partner and currentUserId ready
  useEffect(() => {
    let cancelled = false;
    const mark = async () => {
      if (!partnerId) return;
      const had = await markUnreadFromPartner();
      if (!cancelled && had) {
        try {
          onReadMessages?.();
        } catch (err) {
          console.error("onReadMessages callback error:", err);
        }
      }
    };
    // small delay to avoid race with parent renders
    const t = window.setTimeout(mark, 50);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [partnerId, markUnreadFromPartner, onReadMessages]);

  const handleSend = useCallback(
    async (content: string): Promise<void> => {
      // sendMessage returns payload | null, but this handler must match MiniChatView's Promise<void>
      await sendMessage(content);

      // if this is the first message (no previous messages), notify parent to add conversation
      if (messages.length === 0 && partner && onNewConversation) {
        try {
          onNewConversation({
            partner_id: partner.id,
            username: partner.username || "Unknown",
            avatar_url: partner.avatar_url || "/default-avatar.png",
            last_message: content,
            last_time: new Date().toISOString(),
            is_read: true,
          });
        } catch (err) {
          console.error("onNewConversation callback error:", err);
        }
      }
      // intentionally return void
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