"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  image_url?: string | null;
  children?: ReactNode;
};

export default function SmallCardImage({
  id,
  title,
  image_url,
  children,
}: Props) {
  return (
    <Link
      href={`/deal/${id}`}
      className="
        relative
        block
        w-full
        aspect-[4/3]
        overflow-hidden
        bg-gray-100
      "
    >
      {image_url ? (
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          Không có ảnh
        </div>
      )}

      {/* ✅ CHỖ NÀY */}
      {children}
    </Link>
  );
}
