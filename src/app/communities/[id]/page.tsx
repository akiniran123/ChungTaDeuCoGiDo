"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import CommunityHeader from "./components/CommunityHeader";
import EmptyState from "./components/EmptyState";
import JoinLeaveButton from "./components/JoinLeaveButtons";
import LoadingState from "./components/LoadingState";
import MembersSidebar from "./components/MembersRightSidebar";
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

  useEffect(() => {
    async function unwrap() {
      const resolved = await params;
      setId(resolved.id);
    }
    unwrap();
  }, [params]);

  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

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

        const { data: members, error: membersErr } = await supabase
          .from("community_members")
          .select("user_id")
          .eq("community_id", id);

        if (membersErr) throw membersErr;

        const memberIds = members.map((m) => m.user_id);

        if (memberIds.length === 0) {
          setCommunity(communityData);
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data: productData, error: productErr } = await supabase
          .from("products")
          .select("*")
          .in("user_id", memberIds)
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

  // ⭐ Khôi phục vị trí scroll khi quay lại
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
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* MAIN */}
      <div className="flex-1 bg-white p-6 rounded-l-2xl">
        <CommunityHeader community={community} />

        {/* ⭐ NÚT BACK */}
        <button
          onClick={() => {
            sessionStorage.setItem("scrollPosition", window.scrollY.toString());
            router.back();
          }}
          className="mt-2 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
        >
          ← Quay lại
        </button>

        <div className="flex gap-3 items-center mt-4">
          <JoinLeaveButton communityId={id!} />
          <CreateTagButton communityId={id!} />
        </div>

        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <EmptyState message="Chưa có bài đăng nào trong cộng đồng này." />
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:flex flex-col flex-shrink-0 bg-white p-6 rounded-r-2xl overflow-hidden">
        <MembersSidebar communityId={id!} />
      </div>
    </div>
  );
};

export default CommunityDetailPage;