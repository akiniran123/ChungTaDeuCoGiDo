"use client";

import Image from "next/image";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ProductCard({ title, description, image }: ProductCardProps) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white dark:bg-gray-800">
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="rounded-md object-cover w-full h-40"
      />
      <h2 className="mt-3 font-semibold text-lg">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>
    </div>
  );
}
