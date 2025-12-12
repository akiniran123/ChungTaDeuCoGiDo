"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Product } from "@/types";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

// Product có thêm thông tin user từ join
interface ProductWithUser extends Product {
  users: {
    username: string | null;
    avatar_url: string | null;
  };
}

type PageProps = {
  params: {
    id: string;
  };
};

export default function OtherUserProfile(props: PageProps) {
  const { id } = props.params;

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductWithUser[]>([]);
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
        .single<User>();

      setUser(userData);

      // Lấy sản phẩm của user này (có join với bảng users)
      const { data: productData } = await supabase
        .from("products")
        .select("*, users!inner(username, avatar_url)")
        .eq("user_id", id);

      setProducts((productData as ProductWithUser[]) || []);

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
          alt={user.username}
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
                src={p.image_url ?? "/default-product.png"}
                className="w-full h-40 object-cover"
                alt={p.title}
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>

                {/* Hiển thị thêm thông tin user từ join */}
                {p.users && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <img
                      src={p.users.avatar_url ?? "/default-avatar.png"}
                      className="w-6 h-6 rounded-full object-cover"
                      alt={p.users.username ?? "user"}
                    />
                    <span>{p.users.username}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}