// src/components/MiniChat/ChatContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";

type ChatState = {
  chatOpen: boolean;
  activePartnerId: string | null;
  openChat: (partnerId: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatState | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // single state object to avoid intermediate renders
  const [{ chatOpen, activePartnerId }, setState] = useState({
    chatOpen: false,
    activePartnerId: null as string | null,
  });

  // ref to avoid immediate close after open (race protection)
  const lastOpenAt = useRef<number | null>(null);

  useEffect(() => {
    console.log("[ChatProvider] mount");
    return () => console.log("[ChatProvider] unmount");
  }, []);

  useEffect(() => {
    console.log("[ChatProvider] state change", { chatOpen, activePartnerId });
  }, [chatOpen, activePartnerId]);

  const openChat = useCallback((partnerId: string) => {
    console.log("[ChatProvider] openChat called for", partnerId);

    // nếu đang mở cùng partner thì bỏ qua
    if (chatOpen && activePartnerId === partnerId) {
      console.log("[ChatProvider] openChat ignored (already open for)", partnerId);
      return;
    }

    // cập nhật cả 2 giá trị trong 1 setState để tránh render trung gian
    setState({ chatOpen: true, activePartnerId: partnerId });
    lastOpenAt.current = Date.now();
  }, [chatOpen, activePartnerId]);

  const closeChat = useCallback(() => {
    const now = Date.now();
    // ignore close if chat was opened very recently (avoid immediate toggle)
    if (lastOpenAt.current && now - lastOpenAt.current < 250) {
      console.log("[ChatProvider] closeChat ignored due to recent open");
      return;
    }

    console.log("[ChatProvider] closeChat called (closing chat for)", activePartnerId);
    setState({ chatOpen: false, activePartnerId: null });
  }, [activePartnerId]);

  // memoize context value to keep stable identity and avoid unnecessary re-renders
  const value = useMemo(
    () => ({ chatOpen, activePartnerId, openChat, closeChat }),
    [chatOpen, activePartnerId, openChat, closeChat]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}