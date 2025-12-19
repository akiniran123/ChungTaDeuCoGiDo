// src/components/MiniChat/GlobalMiniChat.tsx
"use client";

import React, { JSX, useEffect, useMemo } from "react";
import MiniChatBox from "@/components/MiniChat/MiniChatBox";
import { useChat } from "@/components/MiniChat/ChatContext";

export default function GlobalMiniChat(): JSX.Element | null {
  const { openChats, focusedId, closeChat, focusChat } = useChat();

  useEffect(() => {
    console.log("[GlobalMiniChat] mount");
    return () => console.log("[GlobalMiniChat] unmount");
  }, []);

  useEffect(() => {
    console.log("[GlobalMiniChat] state change", { openChats, focusedId });
  }, [openChats, focusedId]);

  const miniChatElements = useMemo(() => {
    if (!openChats || openChats.length === 0) {
      console.log("[GlobalMiniChat] not rendering (no openChats)");
      return null;
    }

    console.log("[GlobalMiniChat] memoizing MiniChatBox list", openChats);
    return openChats.map((partnerId, index) => {
      const handleClose = () => {
        console.log("[GlobalMiniChat] onClose called for", partnerId);
        closeChat(partnerId);
      };

      const handleReadMessages = () => {
        console.log("[GlobalMiniChat] onReadMessages for", partnerId);
      };

      const handleNewConversation = (conv: {
        partner_id: string;
        username: string;
        avatar_url: string;
        last_message: string;
        last_time: string;
        is_read: boolean;
      }) => {
        console.log("[GlobalMiniChat] onNewConversation for", partnerId, conv);
        // bạn có thể cập nhật danh sách conversation ở đây nếu cần
      };

      // Nếu muốn focus khi click vào box, bạn có thể gọi focusChat ở nơi phù hợp (ví dụ trong MiniChatView)
      // Nhưng vì MiniChatBox hiện tại không nhận onFocus prop, ta chỉ truyền props mà nó mong đợi.
      return (
        <MiniChatBox
          key={partnerId}
          partnerId={partnerId}
          index={index}
          onClose={handleClose}
          onReadMessages={handleReadMessages}
          onNewConversation={handleNewConversation}
        />
      );
    });
  }, [openChats, focusedId, closeChat, focusChat]);

  if (!miniChatElements) return null;
  return <>{miniChatElements}</>;
}