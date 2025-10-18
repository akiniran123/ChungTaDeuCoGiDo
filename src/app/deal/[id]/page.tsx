"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import { MessageSquare, ThumbsUp, User } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];

export default function DealDetailPage() {
  const { id } = useParams();
  const idParam = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<Product | null>(null);
  const [author, setAuthor] = useState<UserRow | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductDetail() {
      if (!idParam) return;
      setLoading(true);

      // Lấy sản phẩm
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", idParam)
        .single();

      if (productError) {
        console.error("Lỗi khi tải sản phẩm:", productError.message);
        setLoading(false);
        return;
      }

      setProduct(productData);

      // Lấy thông tin tác giả (lấy full fields để match type UserRow)
      if (productData?.user_id) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", productData.user_id)
          .single();

        if (userError) console.error("Lỗi khi tải tác giả:", userError.message);
        setAuthor(userData || null);
      }

      // Lấy bình luận (lấy đủ product_id để match type CommentRow)
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("product_id", idParam)
        .order("created_at", { ascending: true });

      if (commentsError) console.error("Lỗi khi tải bình luận:", commentsError.message);
      setComments(commentsData || []);

      setLoading(false);
    }

    fetchProductDetail();
  }, [idParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ⏳ Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ❌ Không tìm thấy sản phẩm
      </div>
    );
  }

  // Parse hình ảnh (nếu là JSON string)
  let images: string[] = [];
  try {
    if (typeof product.images === "string") images = JSON.parse(product.images);
    else if (Array.isArray(product.images)) images = product.images;
  } catch {
    images = [];
  }

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

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {images.map((m, idx) => (
                <img
                  key={idx}
                  src={m}
                  alt={`${product.title}-${idx}`}
                  className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition"
                />
              ))}
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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{product.upvotes ?? 0} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{product.views ?? 0} lượt xem</span>
              </div>
              <div className="text-gray-500">{product.category}</div>
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
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
              Gửi
            </button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 && (
              <div className="text-gray-600 italic">Chưa có bình luận nào.</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600">
                  {c.user_id.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-800">{c.content}</p>
                  <p className="text-gray-400 text-xs">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
