"use client";

import { useParams } from "next/navigation";
import { useDealDetail } from "@/components/PageDetail/hooks/useDealDetail";
import DealMain from "@/components/PageDetail/Component/DealMain";
import DealSidebar from "@/components/PageDetail/Component/DealSideBar";

export default function DealDetailPage() {
  const { id } = useParams();
  const dealId = Array.isArray(id) ? id[0] : id;

  const { data, loading, commentCount, setCommentCount, handleLike } =
    useDealDetail(dealId ?? null);

  const onCommentCountChange = () => setCommentCount((c) => c + 1);

  if (!dealId) {
    return <div className="pt-20 text-center">❌ ID không hợp lệ</div>;
  }

  if (loading) {
    return <div className="pt-20 text-center">⏳ Đang tải...</div>;
  }

  if (!data) {
    return <div className="pt-20 text-center">❌ Không tìm thấy</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <DealMain
          data={data}
          commentCount={commentCount}
          onCommentCountChange={onCommentCountChange}
          onLike={handleLike}
        />

        <DealSidebar product={data.product} />
      </div>
    </div>
  );
}