"use client";

import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function OtherUserProfile(props: PageProps) {
  // ⭐ FIX: unwrap params + có kiểu đầy đủ
  const { id } = use(props.params);

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // Lấy user
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      setUser(userData);

      // Lấy sản phẩm của user này
      const { data: productData } = await supabase
        .from("products")
        .select("*, users!inner(username, avatar_url)")
        .eq("user_id", id);

      setProducts(productData || []);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải trang cá nhân...
      </div>
    );

  if (!user)
    return (
      <div className="p-6 text-center text-gray-500">
        Không tìm thấy người dùng.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* -------- USER INFO -------- */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <hr className="my-6" />

      {/* -------- USER PRODUCTS -------- */}
      <h2 className="text-xl font-bold mb-4">Bài đăng của người này</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">Người này chưa đăng sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <Link
              href={`/deal/${p.id}`}
              key={p.id}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={p.image_url}
                className="w-full h-40 object-cover"
                alt={p.title}
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
