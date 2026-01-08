"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import CommunityForm from "@/components/CreatCommnunity/Component/CommunityForm";
import CommunityList from "@/components/CreatCommnunity/Component/CommunityList";

type Community = Database["public"]["Tables"]["communities"]["Row"];

export default function CreateCommunityPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải danh sách cộng đồng:", error);
      } else {
        setCommunities((data as Community[] | null) || []);
      }
    };

    fetchCommunities();
  }, []);

  const handleOpenCommunity = (id: string) => {
    router.push(`/community/${id}`);
  };

  const handleCreated = (newCommunity: Community) => {
    setCommunities((prev) => [newCommunity, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-start px-4 py-10">
      <CommunityForm onCreated={handleCreated} />
      <CommunityList communities={communities} onOpen={handleOpenCommunity} />
    </div>
  );
}