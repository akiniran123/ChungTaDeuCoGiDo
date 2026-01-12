import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useChat } from "@/components/MiniChat/ChatContext";

// Định nghĩa lại Type rút gọn
export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  is_anonymous?: boolean;
}

export function useOtherUserProfile(targetId: string | undefined) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { openChat, isOpen, focusChat } = useChat();

  // 1. Lấy ID người dùng hiện tại
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setCurrentUserId(data.user.id);
    };
    getCurrentUser();
  }, []);

  // 2. Hàm lấy dữ liệu profile
  const fetchData = useCallback(async () => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Chỉ truy vấn bảng users
      const { data: profileData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", targetId)
        .maybeSingle();

      if (error) throw error;

      if (!profileData) {
        // Fallback: Nếu không có trong bảng users, lấy từ Auth (dành cho bản thân hoặc anonymous mới)
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && authUser.id === targetId) {
          setUser({
            id: authUser.id,
            username: authUser.is_anonymous ? "Khách dùng thử" : (authUser.user_metadata?.full_name || "Thành viên mới"),
            email: authUser.email || null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            is_anonymous: authUser.is_anonymous
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(profileData);
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải Profile:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic hỗ trợ giao diện
  const isOtherUser = currentUserId !== null && user?.id !== undefined && currentUserId !== user.id;
  const chatAlreadyOpen = user ? isOpen(user.id) : false;

  const handleChat = () => {
    if (!user || !isOtherUser) return;
    chatAlreadyOpen ? focusChat(user.id) : openChat(user.id);
  };

  const toggleFollow = () => setIsFollowing(!isFollowing);

  return { 
    user, 
    loading, 
    isOtherUser, 
    chatAlreadyOpen, 
    isFollowing, 
    handleChat, 
    toggleFollow,
    refreshProfile: fetchData 
  };
}