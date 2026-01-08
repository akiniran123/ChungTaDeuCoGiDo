"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommunityData } from "./hooks/useCommunityData";

import CommunityHeader from "./Components/CommunityHeader";
import EmptyState from "./Components/EmptyState";
import JoinLeaveButton from "./Components/JoinLeaveButtons";
import LoadingState from "./Components/LoadingState";
import ProductList from "./Components/ProductList";
import CreateTagGroupButton from "./Components/CreateTagGroupButton";
import TagGroupList from "./Components/TagGroupList";

// Gộp interface vào export
export interface CommunityDetailViewProps {
  communityId: string;
}

// Chuyển sang Named Export (Xóa chữ default)
export function CommunityDetailView({ communityId }: CommunityDetailViewProps) {
  const router = useRouter();
  const { community, products, tagGroups, loading, error, isAdminOrMod, fetchTagGroups } = useCommunityData(communityId);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const handleBack = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    router.back();
  };

  if (loading) return <LoadingState />;
  if (error) return <div className="p-10 text-center text-red-500">🚨 Error: {error}</div>;
  if (!community) return <EmptyState />;

  return (
    <div className="w-full max-w-screen-xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <CommunityHeader community={community} />

      <button 
        onClick={handleBack} 
        className="mt-2 mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors cursor-pointer"
      >
        ← Quay lại
      </button>

      <div className="flex gap-3 items-center mt-4">
        <JoinLeaveButton communityId={communityId} />
        {isAdminOrMod && (
          <CreateTagGroupButton 
            communityId={communityId} 
            onCreated={() => fetchTagGroups(communityId)} 
          />
        )}
      </div>

      <TagGroupList groups={tagGroups} />

      <div className="mt-6 border-t pt-6">
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <EmptyState message="Chưa có bài đăng nào trong cộng đồng này." />
        )}
      </div>
    </div>
  );
}