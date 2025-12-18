"use client";

import { Bookmark, BookmarkCheck, Heart as HeartIcon, Share2 } from "lucide-react";

type Props = {
  productId: string;
  /** whether current user liked this product */
  liked: boolean;
  /** number of likes to display (per-product) */
  localLikes: number;
  onToggleLike: () => Promise<void> | void;
  /** optional: parent can handle saved state; if omitted this button will still call nothing */
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
  /** optional: whether this product is saved/bookmarked by the user */
  isSaved?: boolean;
};

export default function SmallCardActions({
  productId,
  liked,
  localLikes,
  onToggleLike,
  onToggleSave,
  onShare,
  isSaved = false,
}: Props) {
  return (
    <div className="flex items-center gap-3 ml-3 flex-shrink-0">
      <button
        onClick={onToggleLike}
        className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition cursor-pointer"
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <HeartIcon size={20} fill={liked ? "currentColor" : "none"} />
        <span className="text-sm">{localLikes}</span>
      </button>

      <button
        onClick={onShare}
        className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>

      <button
        onClick={() => onToggleSave?.(productId)}
        className="text-gray-600 hover:text-pink-500 transition cursor-pointer"
        aria-pressed={isSaved}
        aria-label={isSaved ? "Unsave" : "Save"}
      >
        {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </button>
    </div>
  );
}