"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

import DealHeader from "./components/DealHeader";

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
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const commentsEndRef = useRef<HTMLDivElement>(null);

  //  🚫 BỎ auto scroll khi load comment
  // useEffect(() => {
  //   commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [comments]);

  // ⭐ FIX: scroll lên đầu trang khi mở chi tiết
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchDetail() {
      if (!idParam) return;
      setLoading(true);

      try {
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        setProduct(productData);

        if (productData?.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", productData.user_id)
            .single();

          setAuthor(userData);
        }

        const { data: commentsData } = await supabase
          .from("comments")
          .select(`
            *,
            users ( username, avatar_url )
          `)
          .eq("product_id", idParam)
          .order("created_at", { ascending: true });

        setComments(
          (commentsData || []).map((c: any) => ({
            ...c,
            user: {
              username: c.users?.username || "Người dùng",
              avatar_url: c.users?.avatar_url || "/default-avatar.png",
            },
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [idParam]);

  // Gửi bình luận + scroll xuống cuối
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

    setComments((prev) => [
      ...prev,
      {
        ...inserted,
        user: {
          username: inserted.users?.username || "Người dùng",
          avatar_url: inserted.users?.avatar_url || "/default-avatar.png",
        },
      },
    ]);

    setNewComment("");

    // ⭐ Scroll xuống khi gửi comment thôi
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ⏳ Đang tải sản phẩm...
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

        {/* GRID 2 CỘT CHUẨN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT 2/3 — HEADER + COMMENTS */}
          <div className="md:col-span-2 space-y-6">

            {/* HEADER */}
            <DealHeader product={product} author={author} />

            {/* COMMENTS */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                  className="flex-1 border rounded-lg px-4 py-2"
                />
                <button
                  onClick={handleSendComment}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                >
                  Gửi
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
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}

                <div ref={commentsEndRef} />
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 — SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Mô tả sản phẩm</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || "Không có mô tả."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Thông tin sản phẩm</h2>
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
