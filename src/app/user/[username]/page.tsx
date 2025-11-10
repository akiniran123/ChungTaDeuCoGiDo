"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function UserProfilePage() {
  const params = useParams();

  // ✅ Giải mã username từ URL
  const rawUsername = params?.username as string;
  const username = decodeURIComponent(rawUsername.trim());

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Lấy thông tin người dùng
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (userError || !userData) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);

        // 2️⃣ Lấy sản phẩm của user
        const { data: productsData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", userData.id);

        if (productError) throw productError;

        setProducts(productsData || []);
      } catch (err) {
        console.error("⚠️ Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  // ✅ Hàm xóa bài đăng
  const handleDelete = async (productId: string, imageUrl?: string) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa bài đăng này?");
    if (!confirmDelete) return;

    try {
      setDeleting(productId);

      // 🧹 Xóa ảnh trong storage nếu có
      if (imageUrl) {
        // Lấy phần đường dẫn sau /images/
        const parts = imageUrl.split("/images/");
        if (parts.length === 2) {
          const storagePath = parts[1]; // ví dụ: user_123/product-xxx.png
          const { error: removeError } = await supabase.storage
            .from("images")
            .remove([storagePath]);

          if (removeError) {
            console.warn("⚠️ Không xóa được ảnh:", removeError.message);
          } else {
            console.log("🧹 Ảnh đã bị xóa khỏi storage:", storagePath);
          }
        } else {
          console.warn("⚠️ Không thể phân tích được đường dẫn ảnh:", imageUrl);
        }
      }

      // 🗑️ Xóa bài trong bảng products
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      // ✅ Cập nhật danh sách sau khi xóa
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Đã xóa bài đăng và ảnh thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa bài:", err);
      alert("Xóa thất bại, vui lòng thử lại!");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        ⏳ Đang tải dữ liệu...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Người dùng không tồn tại hoặc username sai ({username})
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Thông tin user */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar_url || "/default-avatar.png"}
            alt={user.username}
            className="w-24 h-24 rounded-full border shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              {user.username}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex gap-6 mt-2 text-sm text-gray-500">
              <span>
                Tham gia:{" "}
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("vi-VN")
                  : "Không rõ"}
              </span>
              <span>Karma: {user.karma ?? 0}</span>
              <span>Đang online: {user.is_online ? "✅" : "❌"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Sản phẩm đã đăng
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-lg shadow relative"
              >
                <img
                  src={p.image_url || "/placeholder.png"}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  {p.category} - {p.condition}
                </p>
                <p className="text-indigo-600 font-bold">
                  {p.price?.toLocaleString("vi-VN")}₫
                </p>

                {/* 🗑️ Nút xóa */}
                <button
                  onClick={() => handleDelete(p.id, p.image_url)}
                  disabled={deleting === p.id}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-md text-white text-sm transition ${
                    deleting === p.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleting === p.id ? "Đang xóa..." : "🗑️ Xóa"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Người dùng này chưa đăng sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
}
