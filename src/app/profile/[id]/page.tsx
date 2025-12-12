"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function OtherUserProfile() {
  const params = useParams();
  const rawId = params?.id; // string | string[] | undefined
  const id = Array.isArray(rawId) ? rawId[0] : rawId; // chuẩn hóa thành string | undefined

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
    // Nếu id chưa có, không fetch; giữ loading false để hiển thị thông báo phù hợp
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

        if (userError) {
          console.error("Fetch user error:", userError);
          setUser(null);
        } else {
          setUser(userData || null);
        }

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*, users!inner(username, avatar_url)")
          .eq("user_id", id);

        if (!mounted) return;

        if (productError) {
          console.error("Fetch products error:", productError);
          setProducts([]);
        } else {
          setProducts((productData as ProductWithUser[]) || []);
        }
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
      <div className="p-6 text-center text-gray-500">Đang tải trang cá nhân...</div>
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