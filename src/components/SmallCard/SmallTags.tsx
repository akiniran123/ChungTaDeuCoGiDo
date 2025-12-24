// components/Trang_chu/pc/SmallCardTags.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  tags?: string[];
  communityId?: string | null;
  communityName?: string | null;
  communityIcon?: string | null;
  onTagClick: (tag: string) => void;
};

export default function SmallCardTags({
  tags,
  communityId,
  communityName,
  communityIcon,
  onTagClick,
}: Props) {
  if (!tags && !communityName) return null;

  return (
    <div className="flex-shrink-0 hidden lg:flex flex-col gap-1 ml-2">
      {/* ✅ TÊN CỘNG ĐỒNG – LÊN TRÊN */}
      {communityName && (
        <Link
          href={`/communities/${communityId}`}
          className="flex items-center gap-2 hover:opacity-80 whitespace-nowrap cursor-pointer"
        >
          {communityIcon && (
            <div className="w-6 h-6 rounded-full overflow-hidden relative flex-shrink-0">
              <Image
                src={communityIcon}
                alt="community"
                fill
                className="object-cover"
              />
            </div>
          )}

          <span className="truncate max-w-[140px] text-gray-900">
            {communityName}
          </span>
        </Link>
      )}

      {/* TAGS – XUỐNG DƯỚI */}
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-1 mt-1">
          {tags.slice(0, 4).map((t, i) => (
            <button
              key={i}
              onClick={() => onTagClick(t)}
              className="text-xs bg-pink-50 text-purple-500 px-2 py-1 rounded-full hover:bg-pink-100 whitespace-nowrap cursor-pointer"
            >
              {t}
            </button>
          ))}

          {tags.length > 4 && (
            <div className="text-xs text-gray-400 whitespace-nowrap">
              +{tags.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
