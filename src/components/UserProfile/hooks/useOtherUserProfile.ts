import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import { useChat } from "@/components/MiniChat/ChatContext";

// Types
export interface UserProfile {
  id: string;
  username: string | null; // Cho phép null để khớp với DB
  email: string | null;    // Cho phép null để khớp với DB
  avatar_url: string | null;
}

export interface ProductWithUser extends Product {
  users: { username: string | null; avatar_url: string | null };
}

export function useOtherUserProfile(targetId: string | undefined) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { openChat, isOpen, focusChat } = useChat();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, productRes] = await Promise.all([
          supabase.from("users").select("*").eq("id", targetId).single(),
          supabase.from("products").select("*, users!inner(username, avatar_url)").eq("user_id", targetId)
        ]);

        setUser(userRes.error ? null : userRes.data);
        setProducts(productRes.error ? [] : (productRes.data as ProductWithUser[]));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetId]);

  const isOtherUser = currentUserId !== null && user?.id !== undefined && currentUserId !== user.id;
  const chatAlreadyOpen = user ? isOpen(user.id) : false;

  const handleChat = () => {
    if (!user || !isOtherUser) return;
    chatAlreadyOpen ? focusChat(user.id) : openChat(user.id);
  };

  const toggleFollow = () => setIsFollowing(!isFollowing);

  return { user, products, loading, isOtherUser, chatAlreadyOpen, isFollowing, handleChat, toggleFollow };
}