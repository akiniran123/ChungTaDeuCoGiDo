"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { getSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

import DealHeader from "./components/DealHeader";
import { SendHorizontal } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

type CommentWithUsersRow = CommentRow & {
  users?: { username?: string | null; avatar_url?: string | null } | null;
};

interface CommentWithUser extends CommentRow {
  user: { username: string; avatar_url?: string };
}

export default function DealDetailPage() {
  const supabase = getSupabaseClient();

  const { id } = useParams();
  const idParamRaw = Array.isArray(id) ? id[0] : id;

  // ===== FIX QUAN TRỌNG =====
  if (!idParamRaw) {
    throw new Error("Missing product id from URL");
  }
  const productId = String(idParamRaw);
  // ==========================

  const [product, setProduct] = useState<Product | null>(null);
  const [author, setAuthor] = useState<UserRow | null>(null);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===========================
  // LOAD PRODUCT DETAIL
  // ===========================
  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);

      try {
        // PRODUCT
        const productRes = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        const productData = productRes.data as Product | null;
        setProduct(productData ?? null);

        // AUTHOR
        if (productData?.user_id) {
          const userRes = await supabase
            .from("users")
            .select("*")
            .eq("id", productData.user_id)
            .single();

          setAuthor((userRes.data as UserRow) ?? null);
        }

        // COMMENTS
        const commentsRes = await supabase
          .from("comments")
          .select(`
            *,
            users ( username, avatar_url )
          `)
          .eq("product_id", productId)
          .order("created_at", { ascending: true });

        const commentsData = commentsRes.data as CommentWithUsersRow[] | null;

        const mapped: CommentWithUser[] = (commentsData ?? []).map((c) => ({
          ...c,
          user: {
            username: c.users?.username ?? "Người dùng",
            avatar_url: c.users?.avatar_url ?? "/default-avatar.png",
          },
        }));

        setComments(mapped);
        setCommentCount(mapped.length);

        // LIKES COUNT
        const likesRes = await supabase
          .from("product_likes")
          .select("*", { count: "exact", head: true })
          .eq("product_id", productId);

        setLikesCount(likesRes.count ?? 0);

        // CHECK USER LIKED
        const authRes = await supabase.auth.getUser();
        const currentUser = authRes.data?.user;

        if (currentUser) {
          const likedRes = await supabase
            .from("product_likes")
            .select("*")
            .eq("product_id", productId)
            .eq("user_id", currentUser.id)
            .maybeSingle();

          setLiked(!!likedRes.data);
        }
      } catch (err) {
        console.error("fetchDetail error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [productId, supabase]);

  // ===========================
  // LIKE
  // ===========================
  const handleLike = async () => {
    const authRes = await supabase.auth.getUser();
    const user = authRes.data?.user;

    if (!user) return alert("Bạn cần đăng nhập để thả tim.");
    if (!product) return;

    if (!liked) {
      const insertRes = await supabase.from("product_likes").insert({
        product_id: product.id,
        user_id: user.id,
      });

      if (!insertRes.error) {
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } else {
      const deleteRes = await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id);

      if (!deleteRes.error) {
        setLiked(false);
        setLikesCount((c) => c - 1);
      }
    }
  };

  // ===========================
  // SHARE
  // ===========================
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: product?.title,
        text: "Xem sản phẩm này!",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Đã copy liên kết!");
    }
  };

  // ===========================
  // COMMENT SEND
  // ===========================
  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    const authRes = await supabase.auth.getUser();
    const user = authRes.data?.user;

    if (!user) return alert("Bạn cần đăng nhập để bình luận.");

    const insertRes = await supabase
      .from("comments")
      .insert({
        product_id: productId, // <-- dùng biến đã validated, luôn string
        user_id: user.id,
        content,
      })
      .select(`*, users ( username, avatar_url )`)
      .single();

    const inserted = insertRes.data as CommentWithUsersRow | null;
    if (!inserted) return;

    const formatted: CommentWithUser = {
      ...inserted,
      user: {
        username: inserted.users?.username ?? "Người dùng",
        avatar_url: inserted.users?.avatar_url ?? "/default-avatar.png",
      },
    };

    setComments((prev) => [...prev, formatted]);
    setCommentCount((c) => c + 1);
    setNewComment("");

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // ===========================
  // UI
  // ===========================
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
              onShare={handleShare}
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
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white"
                />

                <button
                  onClick={handleSendComment}
                  className="p-2 rounded-lg hover:bg-gray-200"
                >
                  <SendHorizontal size={22} className="text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                {comments.length === 0 && (
                  <div className="italic text-gray-600">
                    Chưa có bình luận.
                  </div>
                )}

                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                      <Image
                        src={c.user.avatar_url ?? "/default-avatar.png"}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>

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
              <p><strong>Giá:</strong> {product.price ?? "—"}</p>
              <p><strong>Số lượng:</strong> {product.quantity ?? "—"}</p>
              <p><strong>Tình trạng:</strong> {product.condition ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
