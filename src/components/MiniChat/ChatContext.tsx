// src/components/MiniChat/ChatContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ChatState = {
  chatOpen: boolean;
  activePartnerId: string | null;
  openChat: (partnerId: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatState | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ChatProvider] mount");
    return () => {
      console.log("[ChatProvider] unmount");
    };
  }, []);

  useEffect(() => {
    console.log("[ChatProvider] state change", { chatOpen, activePartnerId });
  }, [chatOpen, activePartnerId]);

  const openChat = (partnerId: string) => {
    console.log("[ChatProvider] openChat called for", partnerId);
    setActivePartnerId(partnerId);
    setChatOpen(true);
  };

  const closeChat = () => {
    console.log("[ChatProvider] closeChat called (closing chat for)", activePartnerId);
    setChatOpen(false);
    setActivePartnerId(null);
  };

  return (
    <ChatContext.Provider value={{ chatOpen, activePartnerId, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}