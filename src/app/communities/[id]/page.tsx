"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import type { Database } from "@/types/supabase";

import CommunityHeader from "./components/CommunityHeader";
import EmptyState from "./components/EmptyState";
import JoinLeaveButton from "./components/JoinLeaveButtons";
import LoadingState from "./components/LoadingState";
import MembersSidebar from "./components/MembersRightSidebar";
import ProductList from "./components/ProductList";

type Community = Database["public"]["Tables"]["communities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

interface CommunityDetailPageProps {
  params: Promise<{ id: string }>;
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ params }) => {
  const { id } = use(params);

  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy user hiện tại
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  // Lấy community và products
  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [{ data: communityData }, { data: productData }] = await Promise.all([
          supabase.from("communities").select("*").eq("id", id).single(),
          supabase
            .from("products")
            .select("*")
            .eq("community_id", id)
            .order("created_at", { ascending: false }),
        ]);

        setCommunity(communityData || null);
        setProducts(productData || []);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchAll();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!community) return <EmptyState />;

  return (
    // Wrapper ngoài cùng với padding-top thủ công 45px
    <div className="pt-[45px] min-h-screen w-full bg-gray-50 flex">
      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white p-6 rounded-l-2xl">
        <CommunityHeader community={community} user={user} />
        <JoinLeaveButton communityId={id} />

        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <EmptyState message="Chưa có sản phẩm nào" />
        )}
      </div>

      {/* SIDEBAR */}
      <div className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-white p-6 rounded-r-2xl overflow-hidden">
        <MembersSidebar communityId={id} />
      </div>
    </div>
  );
};

export default CommunityDetailPage;
