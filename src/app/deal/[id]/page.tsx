"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

import DealHeader from "./components/DealHeader";
import { SendHorizontal } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

// Kiểu cho row trả về khi join users relation từ Supabase (nhỏ gọn, không dùng generic supabase)
type CommentWithUsersRow = CommentRow & {
  users?: { username?: string | null; avatar_url?: string | null } | null;
};

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
        const productRes = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        const productData = productRes.data as Product | null;
        if (productRes.error) {
          console.error("Error fetching product:", productRes.error);
        }
        setProduct(productData ?? null);

        // AUTHOR
        if (productData?.user_id) {
          const userRes = await supabase
            .from("users")
            .select("*")
            .eq("id", productData.user_id)
            .single();

          const userData = userRes.data as UserRow | null;
          if (userRes.error) {
            console.error("Error fetching author:", userRes.error);
          }
          setAuthor(userData ?? null);
        }

        // COMMENTS + USER (ép kiểu kết quả)
        const commentsRes = await supabase
          .from("comments")
          .select(`
            *,
            users ( username, avatar_url )
          `)
          .eq("product_id", idParam)
          .order("created_at", { ascending: true });

        if (commentsRes.error) {
          console.error("Error fetching comments:", commentsRes.error);
        }

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

        // LIKES COUNT (head select returns count)
        const likesRes = await supabase
          .from("product_likes")
          .select("*", { count: "exact", head: true })
          .eq("product_id", idParam);

        if (likesRes.error) {
          console.error("Error fetching likes count:", likesRes.error);
        }
        const count = (likesRes.count as number) ?? 0;
        setLikesCount(count);

        // CHECK USER LIKE
        const authRes = await supabase.auth.getUser();
        if (authRes.error) {
          console.error("Auth getUser error:", authRes.error);
        }
        const currentUser = authRes.data?.user;
        if (currentUser) {
          const likedRes = await supabase
            .from("product_likes")
            .select("*")
            .eq("product_id", idParam)
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (likedRes.error) {
            console.error("Error checking liked:", likedRes.error);
          }
          setLiked(!!likedRes.data);
        }
      } catch (err: unknown) {
  if (err instanceof Error) {
    console.error("fetchDetail unexpected error:", err.message, err.stack);
  } else {
    console.error("fetchDetail unexpected error:", JSON.stringify(err));
  }
}
 finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [idParam]);

  // HANDLE LIKE
  const handleLike = async () => {
    const authRes = await supabase.auth.getUser();
    if (authRes.error) {
      console.error("Auth error:", authRes.error);
    }
    const user = authRes.data?.user;

    if (!user) {
      alert("Bạn cần đăng nhập để thả tim.");
      return;
    }

    if (!product) return;

    if (!liked) {
      const insertRes = await supabase.from("product_likes").insert({
        product_id: product.id,
        user_id: user.id,
      });

      if (!insertRes.error) {
        setLiked(true);
        setLikesCount((c) => c + 1);
      } else {
        console.error("Error inserting like:", insertRes.error);
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
      } else {
        console.error("Error deleting like:", deleteRes.error);
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
      try {
        await navigator.clipboard.writeText(url);
        alert("Đã copy liên kết vào clipboard!");
      } catch (e) {
        console.error("Clipboard write failed:", e);
        alert("Không thể copy liên kết.");
      }
    }
  };

  // SEND COMMENT
  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content || !idParam) return;

    const authRes = await supabase.auth.getUser();
    if (authRes.error) {
      console.error("Auth error:", authRes.error);
    }
    const user = authRes.data?.user;

    if (!user) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const insertRes = await supabase
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

    if (insertRes.error) {
      console.error("Error inserting comment:", insertRes.error);
      return;
    }

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
                  <div className="italic text-gray-600">Chưa có bình luận nào.</div>
                )}

                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                      <Image
                        src={c.user.avatar_url ?? "/default-avatar.png"}
                        alt={`${c.user.username} avatar`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div>
                      <p className="font-semibold">{c.user.username}</p>
                      <p>{c.content}</p>

                      <p className="text-gray-400 text-xs">
                        {c.created_at ? new Date(c.created_at).toLocaleString() : "Không rõ thời gian"}
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