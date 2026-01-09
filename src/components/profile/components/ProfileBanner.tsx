"use client";

import Image from "next/image";

type ProfileBannerProps = {
  bannerUrl?: string | null;
};

export default function ProfileBanner({ bannerUrl }: ProfileBannerProps) {
  return (
    <div className="relative w-full h-[220px] bg-gray-200 rounded-xl overflow-hidden">
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt="Profile banner"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No banner
        </div>
      )}
    </div>
  );
}
