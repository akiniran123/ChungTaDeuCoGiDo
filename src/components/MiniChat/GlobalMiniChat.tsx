// src/components/MiniChat/GlobalMiniChat.tsx
"use client";

import React, { useEffect } from "react";
import MiniChatBox from "@/components/MiniChat/MiniChatBox";
import { useChat } from "@/components/MiniChat/ChatContext";

export default function GlobalMiniChat() {
  const { chatOpen, activePartnerId, closeChat } = useChat();

  useEffect(() => {
    console.log("[GlobalMiniChat] mount");
    return () => {
      console.log("[GlobalMiniChat] unmount");
    };
  }, []);

  useEffect(() => {
    console.log("[GlobalMiniChat] state change", { chatOpen, activePartnerId });
  }, [chatOpen, activePartnerId]);

  if (!chatOpen || !activePartnerId) {
    console.log("[GlobalMiniChat] not rendering (chatOpen or activePartnerId falsy)", {
      chatOpen,
      activePartnerId,
    });
    return null;
  }

  console.log("[GlobalMiniChat] rendering MiniChatBox for", activePartnerId);

  return (
    <div key={activePartnerId}>
      <MiniChatBox
        partnerId={activePartnerId}
        onClose={() => {
          console.log("[GlobalMiniChat] onClose called for", activePartnerId);
          closeChat();
        }}
        onReadMessages={() => console.log("Đã đọc tin nhắn với", activePartnerId)}
        onNewConversation={() =>
          console.log("Thêm người này vào MessengerPanel:", activePartnerId)
        }
      />
    </div>
  );
}