"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // 🔹 import Link để không bị lỗi
import { supabase } from "@/lib/supabase/client";
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

export default function OtherUserProfile() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

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
    if (!id) {
      setLoading(false);
      setUser(null);
      setProducts([]);
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single<User>();

        if (!mounted) return;

        setUser(userError ? null : userData || null);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*, users!inner(username, avatar_url)")
          .eq("user_id", id);

        if (!mounted) return;

        setProducts(productError ? [] : ((productData as ProductWithUser[]) || []));
      } catch (err) {
        console.error("Unexpected fetch error:", err);
        if (!mounted) return;
        setUser(null);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải trang cá nhân...
      </div>
    );

  if (!id)
    return (
      <div className="p-6 text-center text-gray-500">
        Không tìm thấy id người dùng trong URL.
      </div>
    );

  if (!user)
    return (
      <div className="p-6 text-center text-gray-500">Không tìm thấy người dùng.</div>
    );

  const isOtherUser = currentUserId !== null && currentUserId !== user.id;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        {/* === Avatar chính === */}
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border border-gray-200 bg-gray-300 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}

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
              <div className="p-3 flex items-center gap-2">
                {/* === Avatar người đăng sản phẩm === */}
                {p.users.avatar_url ? (
                  <img
                    src={p.users.avatar_url}
                    alt={p.users.username ?? "user"}
                    className="w-6 h-6 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full border border-gray-200 bg-gray-300 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm text-gray-600">{p.users.username}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{p.category}</p>
              <h3 className="font-semibold text-lg">{p.title}</h3>
            </Link>
          ))}
        </div>
      )}

      {openMiniChat && user && (
        <MiniChatBox
          partnerId={user.id}
          onClose={() => setOpenMiniChat(false)}
          onReadMessages={() => console.log("Đã đọc tin nhắn với", user.id)}
          onNewConversation={() =>
            console.log("Thêm người này vào MessengerPanel:", user.id)
          }
        />
      )}
    </div>
  );
}
