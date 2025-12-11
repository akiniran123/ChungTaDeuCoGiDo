"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
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
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function unwrap() {
      const resolved = await params;
      setId(resolved.id);
    }
    unwrap();
  }, [params]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!id || !user) return;

    const checkRole = async () => {
      const { data } = await supabase
        .from("community_members")
        .select("role")
        .eq("community_id", id)
        .eq("user_id", user.id)
        .single();

      if (data?.role === "owner") setIsOwner(true);
    };

    checkRole();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);

      try {
        const { data: communityData, error: communityErr } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();

        if (communityErr) throw communityErr;

        const { data: productData, error: productErr } = await supabase
          .from("products")
          .select("*")
          .eq("community_id", id)
          .order("created_at", { ascending: false });

        if (productErr) throw productErr;

        setCommunity(communityData || null);
        setProducts(productData || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }

      setLoading(false);
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
          sessionStorage.setItem("scrollPosition", window.scrollY.toString());
          router.back();
        }}
        className="mt-2 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
      >
        ← Quay lại
      </button>

      <div className="flex gap-3 items-center mt-4">
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