"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

import DealHeader from "./components/DealHeader";
import { SendHorizontal } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

interface CommentWithUser extends CommentRow {
  user: { username: string; avatar_url?: string };
}

export default function DealDetailPage() {
  const { id } = useParams();
  const idParam = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<Product | null>(null);
  const [author, setAuthor] = useState<UserRow | null>(null);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // LIKE STATES
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  // AUTO SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // LOAD DATA
  useEffect(() => {
    async function fetchDetail() {
      if (!idParam) return;

      setLoading(true);

      try {
        // PRODUCT
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        setProduct(productData);

        // AUTHOR
        if (productData?.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", productData.user_id)
            .single();

          setAuthor(userData);
        }

        // COMMENTS + USER
        const { data: commentsData } = await supabase
          .from("comments")
          .select(`
            *,
            users ( username, avatar_url )
          `)
          .eq("product_id", idParam)
          .order("created_at", { ascending: true });

        const mapped = (commentsData || []).map((c: any) => ({
          ...c,
          user: {
            username: c.users?.username || "Người dùng",
            avatar_url: c.users?.avatar_url || "/default-avatar.png",
          },
        }));

        setComments(mapped);
        setCommentCount(mapped.length);

        // LIKES COUNT
        const { count } = await supabase
          .from("product_likes")
          .select("*", { count: "exact", head: true })
          .eq("product_id", idParam);

        setLikesCount(count || 0);

        // CHECK USER LIKE
        const { data: currentUser } = await supabase.auth.getUser();

        if (currentUser.user) {
          const { data: likedData } = await supabase
            .from("product_likes")
            .select("*")
            .eq("product_id", idParam)
            .eq("user_id", currentUser.user.id)
            .maybeSingle();

          setLiked(!!likedData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [idParam]);

  // HANDLE LIKE
  const handleLike = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    if (!product) return;

    if (!liked) {
      const { error } = await supabase.from("product_likes").insert({
        product_id: product.id,
        user_id: user.id,
      });

      if (!error) {
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } else {
      const { error } = await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id);

      if (!error) {
        setLiked(false);
        setLikesCount((c) => c - 1);
      }
    }
  };

  // HANDLE SHARE
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || "Sản phẩm",
          text: "Xem sản phẩm này!",
          url,
        });
      } catch (e) {
        console.log("Share canceled", e);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Đã copy liên kết vào clipboard!");
    }
  };

  // SEND COMMENT
  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content || !idParam) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const { data: inserted } = await supabase
      .from("comments")
      .insert({
        product_id: idParam,
        user_id: user.id,
        content,
      })
      .select(`
        *,
        users ( username, avatar_url )
      `)
      .single();

    if (!inserted) return;

    const formatted = {
      ...inserted,
      user: {
        username: inserted.users?.username || "Người dùng",
        avatar_url: inserted.users?.avatar_url || "/default-avatar.png",
      },
    };

    setComments((prev) => [...prev, formatted]);
    setCommentCount((c) => c + 1);
    setNewComment("");

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center py-20">
  <div className="text-center">⏳ Đang tải sản phẩm...</div>
</div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ❌ Không tìm thấy sản phẩm
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2">
            <DealHeader
              product={product}
              author={author}
              liked={liked}
              likesCount={likesCount}
              commentCount={commentCount}
              onLike={handleLike}
              onShare={handleShare}   // 👉 THÊM SHARE Ở ĐÂY
            />

            {/* COMMENTS */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none"
                />

                <button
                  onClick={handleSendComment}
                  className="p-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <SendHorizontal size={22} className="text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                {comments.length === 0 && (
                  <div className="italic text-gray-600">
                    Chưa có bình luận nào.
                  </div>
                )}

                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <img
                      src={c.user.avatar_url}
                      className="w-10 h-10 rounded-full border object-cover"
                    />

                    <div>
                      <p className="font-semibold">{c.user.username}</p>
                      <p>{c.content}</p>

                      <p className="text-gray-400 text-xs">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleString()
                          : "Không rõ thời gian"}
                      </p>
                    </div>
                  </div>
                ))}

                <div ref={commentsEndRef} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-10 py-2 pl-20 ml-10">
            <div>
              <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || "Không có mô tả."}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h2>
              <p>
                <strong>Giá:</strong> {product.price ?? "—"}
              </p>
              <p>
                <strong>Số lượng:</strong> {product.quantity ?? "—"}
              </p>
              <p>
                <strong>Tình trạng:</strong> {product.condition ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
