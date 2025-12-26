"use client";

import {
  Bookmark,
  BookmarkCheck,
  Heart as HeartIcon,
  Share2,
  MessageCircle,
} from "lucide-react";

type Props = {
  productId: string;
  liked: boolean;
  localLikes: number;
  commentsCount: number;
  onToggleLike: () => Promise<void> | void;
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
  isSaved?: boolean;
};

export default function SmallCardActions({
  productId,
  liked,
  localLikes,
  commentsCount,
  onToggleLike,
  onToggleSave,
  onShare,
  isSaved = false,
}: Props) {
  return (
    <div className="flex items-center gap-4 ml-3 flex-shrink-0">
      {/* LIKE */}
      <button
        onClick={onToggleLike}
        className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"
        aria-pressed={liked}
      >
        <HeartIcon size={20} fill={liked ? "currentColor" : "none"} />
        <span className="text-sm">{localLikes}</span>
      </button>

      {/* COMMENT (ở GIỮA) */}
      <div className="flex items-center gap-1 text-gray-600">
        <MessageCircle size={18} />
        <span className="text-sm">{commentsCount}</span>
      </div>

      {/* SHARE */}
      <button
        onClick={onShare}
        className="text-gray-600 hover:text-gray-800 transition"
      >
        <Share2 size={20} />
      </button>

      {/* SAVE */}
      <button
        onClick={() => onToggleSave?.(productId)}
        className="text-gray-600 hover:text-pink-500 transition"
        aria-pressed={isSaved}
      >
        {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
      </button>
    </div>
  );
}
