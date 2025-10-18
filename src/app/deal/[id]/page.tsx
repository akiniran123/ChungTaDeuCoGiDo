"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { User } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

interface CommentWithUser extends CommentRow {
  user: {
    username: string;
    avatar_url?: string;
  };
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

  // Lấy chi tiết sản phẩm + author + comments
  useEffect(() => {
    async function fetchProductDetail() {
      if (!idParam) return;
      setLoading(true);

      try {
        // Lấy sản phẩm
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Lấy thông tin tác giả
        if (productData?.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", productData.user_id)
            .single();
          setAuthor(userData || null);
        }

        // Lấy bình luận kèm user info
        const { data: commentsData } = await supabase
          .from("comments")
          .select(`
            *,
            users (
              username,
              avatar_url
            )
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
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [idParam]);

  // Scroll xuống dưới khi có bình luận mới
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content) return;
    if (!idParam) return;

    // Lấy user hiện tại
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user?.id) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    // Insert comment vào Supabase và lấy luôn thông tin user
    const { data: inserted, error } = await supabase
      .from("comments")
      .insert({
        product_id: idParam,
        user_id: user.id,
        content,
      })
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `)
      .single();

    if (error || !inserted) {
      console.error(error);
      return;
    }

    // Thêm comment ngay vào UI
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Khung chính */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

          {product.image_url && (
            <div className="w-full mb-6">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full max-h-[480px] object-cover rounded-xl shadow"
              />
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <p className="text-lg leading-relaxed">
              {product.description || "Không có mô tả cho sản phẩm này."}
            </p>
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span>
                Tác giả: <strong>{author?.username || product.user_id}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bình luận */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <button
              onClick={handleSendComment}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
            >
              Gửi
            </button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 && (
              <div className="text-gray-600 italic">Chưa có bình luận nào.</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img
                  src={c.user.avatar_url}
                  alt={c.user.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{c.user.username}</p>
                  <p className="text-gray-800">{c.content}</p>
                  <p className="text-gray-400 text-xs">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
