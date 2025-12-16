"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DealHeader from "./components/DealHeader";
import DealComments from "./components/DealComments";
import {
  getDealDetail,
  type DealDetailResult,
} from "../services/getDealDetail";
import { supabase } from "@/lib/supabase/client";

export default function DealDetailPage() {
  const { id } = useParams();
  const dealId = Array.isArray(id) ? id[0] : id;

  const [data, setData] = useState<DealDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!dealId) return;

    getDealDetail(dealId).then((res) => {
      if (res) {
        setData(res);
        setCommentCount(res.comments.length);
      }
      setLoading(false);
    });
  }, [dealId]);

  // =======================
  // ❤️ HANDLE LIKE (FIXED)
  // =======================
  const handleLike = async () => {
    if (!data) return;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      alert("Bạn cần đăng nhập để thả tim");
      return;
    }

    const userId = auth.user.id;
    const productId = data.product.id;

    if (data.liked) {
      // ❌ UNLIKE
      await supabase
        .from("product_likes") // ✅ FIX
        .delete()
        .eq("product_id", productId)
        .eq("user_id", userId);

      setData((prev) =>
        prev
          ? {
              ...prev,
              liked: false,
              likesCount: prev.likesCount - 1,
            }
          : prev
      );
    } else {
      // ❤️ LIKE
      await supabase
        .from("product_likes") // ✅ FIX
        .insert({
          product_id: productId,
          user_id: userId,
        });

      setData((prev) =>
        prev
          ? {
              ...prev,
              liked: true,
              likesCount: prev.likesCount + 1,
            }
          : prev
      );
    }
  };

  // =======================
  // RENDER
  // =======================

  if (!dealId) {
    return <div className="pt-20 text-center">❌ ID không hợp lệ</div>;
  }

  if (loading) {
    return <div className="pt-20 text-center">⏳ Đang tải...</div>;
  }

  if (!data) {
    return <div className="pt-20 text-center">❌ Không tìm thấy</div>;
  }

  const { product, author, comments, liked, likesCount } = data;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DealHeader
            product={product}
            author={author}
            liked={liked}
            likesCount={likesCount}
            commentCount={commentCount}
            onLike={handleLike} // ✅ OK
          />

          <DealComments
            productId={dealId}
            initialComments={comments}
            onCountChange={() => setCommentCount((c) => c + 1)}
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-semibold">Mô tả</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
