"use client";

import DealHeader from "@/components/detail/DealHeader";
import DealComments from "@/components/detail/DealComments";
import type { DealDetailResult } from "@/components/PageDetail/hooks/getDealDetail";

export default function DealMain({
  data,
  commentCount,
  onCommentCountChange,
  onLike,
}: {
  data: DealDetailResult;
  commentCount: number;
  onCommentCountChange: () => void;
  onLike: () => Promise<void>;
}) {
  const { product, author, comments, liked, likesCount } = data;

  /**
   * Vì chúng ta đã chuẩn hóa `product.images` thành `string[] | null` trong 
   * getDealDetail.ts, nên không cần bước logic kiểm tra Array.isArray ở đây nữa.
   * TypeScript giờ đây đã hiểu đúng kiểu dữ liệu.
   */
  const productForHeader = {
    ...product,
    // images đã chuẩn là string[] | null từ hook
    images: product.images, 
  } as unknown as Parameters<typeof DealHeader>[0]["product"];

  return (
    <div className="md:col-span-2 space-y-6">
      <DealHeader
        product={productForHeader}
        author={author}
        liked={liked}
        likesCount={likesCount}
        commentCount={commentCount}
        onLike={onLike}
      />

      <div className="border-t pt-8">
        <DealComments
          productId={product.id}
          initialComments={comments}
          onCountChange={onCommentCountChange}
        />
      </div>
    </div>
  );
}