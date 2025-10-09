"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Lấy thông tin người dùng theo username
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (userError || !userData) {
          console.error("Không tìm thấy người dùng:", userError);
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);

        // 2️⃣ Lấy danh sách sản phẩm theo user_id
        const { data: productsData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", userData.id);

        if (productError) throw productError;

        setProducts(productsData || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

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
        ❌ Người dùng không tồn tại
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

      {/* Sản phẩm */}
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Sản phẩm đã đăng
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow">
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
                  {p.price.toLocaleString("vi-VN")}₫
                </p>
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
