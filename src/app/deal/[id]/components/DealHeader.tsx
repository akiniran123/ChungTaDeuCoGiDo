"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, MessageCircle } from "lucide-react";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

export default function DealHeader({
  product,
  author,
  liked,
  likesCount,
  commentCount,
  onLike,
  onShare,
}: {
  product: Product;
  author: UserRow | null;
  liked: boolean;
  likesCount: number;
  commentCount: number;
  onLike?: () => void;
  onShare?: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm space-y-4">
      {/* 👤 USER + AVATAR + TIME */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {author && (
          <>
            {/* AVATAR */}
            <Link
              href={`/profile/${author.id}`}
              className="relative w-8 h-8 rounded-full overflow-hidden border"
            >
              <Image
                src={author.avatar_url ?? "/default-avatar.png"}
                alt={author.username ?? "User"}
                fill
                className="object-cover"
              />
            </Link>

            {/* USERNAME */}
            <Link
              href={`/profile/${author.id}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {author.username}
            </Link>
          </>
        )}

        <span>•</span>

        {/* TIME */}
        <span>
          {product.created_at
            ? new Date(product.created_at).toLocaleString()
            : ""}
        </span>
      </div>

      {/* 🏷️ TITLE */}
      <h1 className="text-2xl font-bold">{product.title}</h1>

      {/* 🖼️ PRODUCT IMAGE */}
      {product.image_url && (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-6 pt-2">
        <button
          onClick={onLike}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <Heart
            size={20}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
          <span>{likesCount}</span>
        </button>

        <div className="flex items-center gap-1 text-gray-600">
          <MessageCircle size={20} />
          <span>{commentCount}</span>
        </div>

        <button
          onClick={onShare}
          className="flex items-center gap-1 text-gray-600 hover:text-black transition"
        >
          <Share2 size={20} />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
