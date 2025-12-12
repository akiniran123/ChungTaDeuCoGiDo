"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Product } from "@/types";
import MiniChatBox from "@/components/MiniChat/MiniChatBox";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

interface ProductWithUser extends Product {
  users: {
    username: string | null;
    avatar_url: string | null;
  };
}

// NOTE: declare params inline to avoid type conflict with Next generated PageProps
export default function OtherUserProfile({
 params: { id: userId },
}: {
  params: { id: string };
}) {
  // dùng userId thay vì id
  const id = userId;


  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMiniChat, setOpenMiniChat] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single<User>();

      setUser(userData);

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
      <div className="p-6 text-center text-gray-500">Đang tải trang cá nhân...</div>
    );

  if (!user)
    return (
      <div className="p-6 text-center text-gray-500">Không tìm thấy người dùng.</div>
    );

  const isOtherUser = currentUserId !== null && currentUserId !== user.id;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          className="w-20 h-20 rounded-full object-cover"
          alt={user.username}
        />
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {isOtherUser && (
            <button
              className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setOpenMiniChat(true)}
            >
              Nhắn tin
            </button>
          )}
        </div>
      </div>

      <hr className="my-6" />

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

      {openMiniChat && user && (
        <MiniChatBox
          partnerId={user.id}
          onClose={() => setOpenMiniChat(false)}
          onReadMessages={() => {
            console.log("Đã đọc tin nhắn với", user.id);
          }}
          onNewConversation={() => {
            console.log("Thêm người này vào MessengerPanel:", user.id);
          }}
        />
      )}
    </div>
  );
}