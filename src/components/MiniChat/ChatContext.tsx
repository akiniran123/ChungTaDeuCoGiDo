// src/components/MiniChat/ChatContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

type ChatContextValue = {
  openChats: string[]; // list of partnerId đang mở
  focusedId: string | null; // partnerId đang được focus (optional)
  openChat: (partnerId: string) => void;
  closeChat: (partnerId: string) => void;
  toggleChat: (partnerId: string) => void;
  focusChat: (partnerId: string) => void;
  isOpen: (partnerId: string) => boolean;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // openChats lưu danh sách partnerId đang mở
  const [openChats, setOpenChats] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // ref để tránh đóng ngay sau khi mở (race protection) cho từng partner
  const lastOpenAtRef = useRef<Record<string, number>>({});

  useEffect(() => {
    console.log("[ChatProvider] mount");
    return () => console.log("[ChatProvider] unmount");
  }, []);

  useEffect(() => {
    console.log("[ChatProvider] state change", { openChats, focusedId });
  }, [openChats, focusedId]);

  const openChat = useCallback((partnerId: string) => {
    console.log("[ChatProvider] openChat called for", partnerId);

    setOpenChats((prev) => {
      if (prev.includes(partnerId)) {
        // vẫn focus nếu đã mở
        setFocusedId(partnerId);
        return prev;
      }
      const next = [...prev, partnerId];
      setFocusedId(partnerId);
      lastOpenAtRef.current[partnerId] = Date.now();
      return next;
    });
  }, []);

  const closeChat = useCallback((partnerId: string) => {
    const now = Date.now();
    const lastOpenAt = lastOpenAtRef.current[partnerId] ?? null;

    // ignore close if chat was opened very recently (avoid immediate toggle)
    if (lastOpenAt && now - lastOpenAt < 250) {
      console.log(
        "[ChatProvider] closeChat ignored due to recent open for",
        partnerId
      );
      return;
    }

    console.log("[ChatProvider] closeChat called for", partnerId);
    setOpenChats((prev) => prev.filter((id) => id !== partnerId));
    setFocusedId((prev) => (prev === partnerId ? null : prev));
    // cleanup timestamp
    delete lastOpenAtRef.current[partnerId];
  }, []);

  const toggleChat = useCallback((partnerId: string) => {
    setOpenChats((prev) => {
      if (prev.includes(partnerId)) {
        // close
        // respect recent-open protection
        const now = Date.now();
        const lastOpenAt = lastOpenAtRef.current[partnerId] ?? null;
        if (lastOpenAt && now - lastOpenAt < 250) {
          console.log(
            "[ChatProvider] toggleChat ignored due to recent open for",
            partnerId
          );
          return prev;
        }
        setFocusedId((f) => (f === partnerId ? null : f));
        delete lastOpenAtRef.current[partnerId];
        return prev.filter((id) => id !== partnerId);
      } else {
        // open
        lastOpenAtRef.current[partnerId] = Date.now();
        setFocusedId(partnerId);
        return [...prev, partnerId];
      }
    });
  }, []);

  const focusChat = useCallback((partnerId: string) => {
    if (!partnerId) return;
    setFocusedId(partnerId);
    // optional: move to end to reflect recency
    setOpenChats((prev) => {
      if (!prev.includes(partnerId)) return [...prev, partnerId];
      return [...prev.filter((id) => id !== partnerId), partnerId];
    });
  }, []);

  const isOpen = useCallback(
    (partnerId: string) => openChats.includes(partnerId),
    [openChats]
  );

  const value = useMemo(
    () => ({
      openChats,
      focusedId,
      openChat,
      closeChat,
      toggleChat,
      focusChat,
      isOpen,
    }),
    [openChats, focusedId, openChat, closeChat, toggleChat, focusChat, isOpen]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}