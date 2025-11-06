"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  PlusCircle,
  Users,
  Tag,
  Globe,
  Eye,
  Heart,
  LogIn,
  LogOut,
} from "lucide-react";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👤 User và trạng thái tham gia cộng đồng
  const [user, setUser] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // 🧠 Lấy user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // 🧠 Lấy dữ liệu từ Supabase
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: communityData, error: communityError } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityError) throw communityError;
        setCommunity(communityData);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("community_id", id)
          .order("created_at", { ascending: false });

        if (productError) throw productError;
        setProducts(productData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🧩 Kiểm tra xem user đã tham gia cộng đồng chưa
  useEffect(() => {
    const checkJoined = async () => {
      if (!user || !id) return;
      const { data, error } = await supabase
        .from("community_members")
        .select("*")
        .eq("community_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) setJoined(true);
      else setJoined(false);
    };
    checkJoined();
  }, [user, id]);

  // ➕ Tham gia cộng đồng
  const handleJoin = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia cộng đồng.");
      return;
    }
    setJoinLoading(true);
    const { error } = await supabase.from("community_members").insert({
      user_id: user.id,
      community_id: id,
      role: "member",
      joined_at: new Date().toISOString(),
    });
    if (error) alert("Lỗi khi tham gia cộng đồng: " + error.message);
    else setJoined(true);
    setJoinLoading(false);
  };

  // 🚪 Rời khỏi cộng đồng
  const handleLeave = async () => {
    if (!user) return;
    setJoinLoading(true);
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", id)
      .eq("user_id", user.id);
    if (error) alert("Lỗi khi rời cộng đồng: " + error.message);
    else setJoined(false);
    setJoinLoading(false);
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-500 mr-2" />
        Đang tải dữ liệu...
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Lỗi tải dữ liệu: {error}
      </div>
    );

  if (!community) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {community.title}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                {community.description || "Chưa có mô tả cho cộng đồng này."}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />{" "}
                  {community.category || "Chưa phân loại"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />{" "}
                  {community.members ?? 0} thành viên
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />{" "}
                  {community.online ?? 0} đang hoạt động
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* ✅ Nút tham gia/rời cộng đồng */}
              {joined ? (
                <button
                  onClick={handleLeave}
                  disabled={joinLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition shadow-sm"
                >
                  {joinLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                  Rời cộng đồng
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joinLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-sm"
                >
                  {joinLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  Tham gia cộng đồng
                </button>
              )}

              {/* Nút tạo bài đăng */}
              <button
                onClick={() =>
                  router.push(`/create-product?community_id=${community.id}`)
                }
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-sm"
              >
                <PlusCircle className="w-5 h-5" />
                Tạo bài đăng
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bài đăng trong cộng đồng
          </h2>

          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              Chưa có bài đăng nào trong cộng đồng này.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/deal/${p.id}`} // ✅ chuyển sang trang chi tiết sản phẩm
                  className="group border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={p.image_url || "/placeholder.png"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {p.description || "Không có mô tả."}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <p className="text-indigo-600 font-semibold mb-1">
                        {p.price
                          ? `${p.price.toLocaleString()}₫`
                          : "Liên hệ"}
                      </p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {p.views ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-500" />{" "}
                          {p.upvotes ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
