"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import MiniChatBox from "@/components/MiniChat/MiniChatBox";
import { useChat } from "@/components/MiniChat/ChatContext";

export default function GlobalMiniChat() {
  const { chatOpen, activePartnerId, closeChat } = useChat();

  useEffect(() => {
    console.log("[GlobalMiniChat] mount");
    return () => console.log("[GlobalMiniChat] unmount");
  }, []);

  useEffect(() => {
    console.log("[GlobalMiniChat] state change", { chatOpen, activePartnerId });
  }, [chatOpen, activePartnerId]);

  // Stable callbacks so props identity doesn't change unnecessarily
  const handleClose = useCallback(() => {
    console.log("[GlobalMiniChat] onClose called for", activePartnerId);
    closeChat();
  }, [closeChat, activePartnerId]);

  const handleReadMessages = useCallback(() => {
    console.log("Đã đọc tin nhắn với", activePartnerId);
  }, [activePartnerId]);

  const handleNewConversation = useCallback(() => {
    console.log("Thêm người này vào MessengerPanel:", activePartnerId);
  }, [activePartnerId]);

  // useMemo called unconditionally to preserve Hook order
  const miniChatElement = useMemo(() => {
    if (!chatOpen || !activePartnerId) return null;

    console.log("[GlobalMiniChat] memoizing MiniChatBox for", activePartnerId);
    return (
      <MiniChatBox
        partnerId={activePartnerId}
        onClose={handleClose}
        onReadMessages={handleReadMessages}
        onNewConversation={handleNewConversation}
      />
    );
  }, [chatOpen, activePartnerId, handleClose, handleReadMessages, handleNewConversation]);

  if (!miniChatElement) {
    console.log("[GlobalMiniChat] not rendering (chatOpen or activePartnerId falsy)", {
      chatOpen,
      activePartnerId,
    });
    return null;
  }

  return <>{miniChatElement}</>;
}