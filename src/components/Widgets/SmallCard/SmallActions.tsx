// components/Trang_chu/pc/SmallCardActions.tsx
"use client";

import { Bookmark, BookmarkCheck, Heart as HeartIcon, Share2 } from "lucide-react";

type Props = {
  productId: string;
  likedIds: string[];
  localLikes: number;
  onToggleLike: () => Promise<void> | void;
  onToggleSave: (id: string) => void;
  onShare: () => void;
};

export default function SmallCardActions({
  productId,
  likedIds,
  localLikes,
  onToggleLike,
  onToggleSave,
  onShare,
}: Props) {
  return (
    <div className="flex items-center gap-3 ml-3 flex-shrink-0">
      <button
        onClick={onToggleLike}
        className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition cursor-pointer"
      >
        <HeartIcon size={20} fill={likedIds.includes(productId) ? "currentColor" : "none"} />
        <span className="text-sm">{localLikes}</span>
      </button>

      <button onClick={onShare} className="text-gray-600 hover:text-gray-800 transition cursor-pointer">
        <Share2 size={20} />
      </button>

      <button onClick={() => onToggleSave(productId)} className="text-gray-600 hover:text-pink-500 transition cursor-pointer">
        {/* Local saved state is managed in parent; parent can pass a boolean if preferred */}
        {/* Here we assume parent toggles saved and re-renders accordingly */}
        <Bookmark size={20} />
      </button>
    </div>
  );
}