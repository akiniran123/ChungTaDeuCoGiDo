"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { getDealDetail, type DealDetailResult } from "@/components/PageDetail/hooks/getDealDetail";

export function useDealDetail(dealId?: string | null) {
  const [data, setData] = useState<DealDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  // increase view once per client
  useEffect(() => {
    if (!dealId) return;
    const key = `viewed_product_${dealId}`;
    if (localStorage.getItem(key)) return;

    const increaseView = async () => {
      try {
        await supabase.rpc("increment_product_view", { p_product_id: dealId });
        localStorage.setItem(key, "true");
      } catch (err) {
        console.error("Increase view error:", err);
      }
    };

    increaseView();
  }, [dealId]);

  // fetch detail
  useEffect(() => {
    if (!dealId) return;
    setLoading(true);

    getDealDetail(dealId)
      .then((res) => {
        if (res) {
          setData(res);
          setCommentCount(res.comments.length);
        } else {
          setData(null);
        }
      })
      .catch((err) => {
        console.error("getDealDetail error:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [dealId]);

  // handle like
  const handleLike = useCallback(async () => {
    if (!data) return;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      alert("Bạn cần đăng nhập để thả tim");
      return;
    }

    const userId = auth.user.id;
    const productId = data.product.id;

    try {
      if (data.liked) {
        await supabase
          .from("product_likes")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", userId);

        setData((prev) =>
          prev ? { ...prev, liked: false, likesCount: prev.likesCount - 1 } : prev
        );
      } else {
        await supabase.from("product_likes").insert({
          product_id: productId,
          user_id: userId,
        });

        setData((prev) =>
          prev ? { ...prev, liked: true, likesCount: prev.likesCount + 1 } : prev
        );
      }
    } catch (err) {
      console.error("handleLike error:", err);
    }
  }, [data]);

  return {
    data,
    setData,
    loading,
    commentCount,
    setCommentCount,
    handleLike,
  } as const;
}