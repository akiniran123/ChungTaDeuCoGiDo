"use client";

import Link from "next/link";

type Props = {
  tags?: string[];
  communityId?: string | null;
  communityName?: string | null;
  communityIcon?: string | null; // giữ type để không ảnh hưởng file khác
  onTagClick: (tag: string) => void;
};

export default function SmallCardTags({
  tags,
  communityId,
  communityName,
  onTagClick,
}: Props) {
  if (!tags && !communityName) return null;

  return (
    <>
      {/* ✅ TÊN CỘNG ĐỒNG (KHÔNG AVATAR) */}
      {communityName && (
        <div className="px-4 pt-2">
          <Link
            href={`/communities/${communityId}`}
            className="hover:opacity-80 cursor-pointer"
          >
            <span className="truncate max-w-[180px] text-sm text-gray-900 font-medium block">
              {communityName}
            </span>
          </Link>
        </div>
      )}

      {/* ✅ TAGS (PHÒNG TRƯỜNG HỢP DÙNG NGOÀI) */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-2">
          {tags.map((t, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick(t);
              }}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-300 cursor-pointer"
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
