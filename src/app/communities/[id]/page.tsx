"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import type { User } from "@supabase/supabase-js";
import CommunityHeader from "./components/CommunityHeader";
import EmptyState from "./components/EmptyState";
import JoinLeaveButton from "./components/JoinLeaveButtons";
import LoadingState from "./components/LoadingState";
import ProductList from "./components/ProductList";
import CreateTagButton from "./components/CreateTagButton";
import { useRouter } from "next/navigation";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

interface CommunityDetailPageProps {
  params: Promise<{ id: string }>;
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function unwrap() {
      try {
        const resolved = await params;
        setId(resolved.id);
      } catch (err: unknown) {
        console.error("Failed to resolve params:", err);
      }
    }
    unwrap();
  }, [params]);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      // res.data may be undefined; guard and cast safely
      const data = res.data;
      if (data?.user) setUser(data.user);
    }).catch((err: unknown) => {
      console.error("Auth getUser error:", err);
    });
  }, []);

  useEffect(() => {
    if (!id || !user) return;

    const checkRole = async () => {
      try {
        const res = await supabase
          .from("community_members")
          .select("role")
          .eq("community_id", id)
          .eq("user_id", user.id)
          .single();

        const row = res.data as { role?: string } | null;
        if (row?.role === "owner") setIsOwner(true);
      } catch (err: unknown) {
        console.error("Error checking role:", err);
      }
    };

    checkRole();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const communityRes = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityRes.error) throw communityRes.error;
        const communityData = communityRes.data as Community | null;

        const productRes = await supabase
          .from("products")
          .select("*")
          .eq("community_id", id)
          .order("created_at", { ascending: false });

        if (productRes.error) throw productRes.error;
        const productData = (productRes.data as Product[] | null) ?? [];

        setCommunity(communityData);
        setProducts(productData);
      } catch (err: unknown) {
        console.error("Fetch community error:", err);
        const message = err instanceof Error ? err.message : String(err ?? "Không xác định");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!community) return <EmptyState />;

  return (
    <div className="w-full max-w-screen-xl mx-auto bg-white p-6 rounded-2xl">
      <CommunityHeader community={community} />

      <button
        onClick={() => {
          try {
            sessionStorage.setItem("scrollPosition", window.scrollY.toString());
          } catch (e) {
            // ignore sessionStorage errors in some environments
          }
          router.back();
        }}
        className="mt-2 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
      >
        ← Quay lại
      </button>

      <div className="flex gap-3 items-center mt-4">
        {/* Guard id with non-null assertion only after we've confirmed community exists */}
        <JoinLeaveButton communityId={id!} />
        {isOwner && <CreateTagButton communityId={id!} />}
      </div>

      {products.length > 0 ? (
        <div className="mt-6">
          <ProductList products={products} />
        </div>
      ) : (
        <EmptyState message="Chưa có bài đăng nào trong cộng đồng này." />
      )}
    </div>
  );
};

export default CommunityDetailPage;