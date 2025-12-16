"use client";

import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export default function DealAuthor({
  author,
  createdAt,
}: {
  author: UserRow | null;
  createdAt?: string | null;
}) {
  if (!author) return null;

  return (
    <div className="flex items-center gap-3">
      {/* AVATAR */}
      <Link
        href={`/profile/${author.id}`}
        className="w-10 h-10 relative rounded-full overflow-hidden border"
      >
        <Image
          src={author.avatar_url ?? "/default-avatar.png"}
          alt={author.username ?? "User"}
          fill
          className="object-cover"
        />
      </Link>

      <div>
        {/* USERNAME */}
        <Link
          href={`/profile/${author.id}`}
          className="font-semibold text-gray-800 hover:underline"
        >
          {author.username ?? "Người dùng"}
        </Link>

        {/* TIME */}
        {createdAt && (
          <p className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
