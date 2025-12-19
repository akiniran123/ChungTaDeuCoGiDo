// hooks/useProductActions.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type UseProductActionsParams = {
  productId: string;
  initialLikes: number;
  initialLiked?: boolean; // allow the caller to pass it
  onToggleLike?: () => void;
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
};

type NavigatorWithShare = Navigator & {
  share?: (data: { title?: string; url?: string }) => Promise<void>;
};

export default function useProductActions({
  productId,
  initialLikes,
  initialLiked: _initialLiked, // rename to avoid "defined but never used" lint warning
  onToggleLike,
  onToggleSave,
  onShare,
}: UseProductActionsParams) {
  const [saved, setSaved] = useState<string[]>([]);
  const [localLikes, setLocalLikes] = useState<number>(initialLikes);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLocalLikes(initialLikes);
  }, [initialLikes]);

  const toggleSave = useCallback(
    (id: string) => {
      setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      onToggleSave?.(id);
    },
    [onToggleSave]
  );

  const toggleLike = useCallback(
    async (liked: boolean) => {
      if (processing) return;
      setProcessing(true);

      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user?.id) {
          alert("Bạn cần đăng nhập");
          return;
        }

        if (liked) {
          await supabase.from("product_likes").delete().eq("product_id", productId).eq("user_id", auth.user.id);
          setLocalLikes((prev) => Math.max(prev - 1, 0));
        } else {
          await supabase.from("product_likes").insert({ product_id: productId, user_id: auth.user.id });
          setLocalLikes((prev) => prev + 1);
        }

        onToggleLike?.();
      } catch (err) {
        console.error("toggleLike error:", err);
      } finally {
        setProcessing(false);
      }
    },
    [productId, processing, onToggleLike]
  );

  const share = useCallback(
    (title?: string) => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/deal/${productId}`;

      const nav = typeof navigator !== "undefined" ? (navigator as NavigatorWithShare) : undefined;
      if (nav?.share) {
        nav.share({ title: title ?? "", url }).catch((err) => {
          console.error("Web Share failed:", err);
          onShare?.();
          alert(`Copy liên kết để chia sẻ: ${url}`);
        });
      } else {
        onShare?.();
        alert(`Copy liên kết để chia sẻ: ${url}`);
      }
    },
    [productId, onShare]
  );

  return {
    saved,
    localLikes,
    processing,
    toggleSave,
    toggleLike,
    share,
  };
}