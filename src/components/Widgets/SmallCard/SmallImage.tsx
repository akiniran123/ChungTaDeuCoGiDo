// components/Trang_chu/pc/SmallCardImage.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  image_url?: string | null;
};

export default function SmallCardImage({ id, title, image_url }: Props) {
  return (
    <Link
      href={`/deal/${id}`}
      className="flex-shrink-0 overflow-hidden w-[195px] h-[195px] bg-gray-100 rounded-lg relative"
    >
      {image_url ? (
        <Image src={image_url} alt={title} fill className="object-cover" sizes="195px" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Không có ảnh
        </div>
      )}
    </Link>
  );
}