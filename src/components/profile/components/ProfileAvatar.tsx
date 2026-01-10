"use client";

import Image from "next/image";
import type { UserData } from "@/components/profile/type/types";

export default function ProfileAvatar({
  user,
  avatarUrl,
}: {
  user: UserData;
  avatarUrl: string;
}) {
  return (
    <div className="flex flex-col items-center mt-6">
      {/* 🔽 Avatar nhỏ hơn nữa */}
      <div className="w-16 h-16 rounded-full overflow-hidden border shadow">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="avatar"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-full h-full p-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </div>

      {/* 🔽 Tên user giữ nguyên như cũ */}
      <h2 className="text-sm font-medium mt-2">
        {user.username || "Người dùng"}
      </h2>

      {/* ❌ ĐÃ BỎ HIỂN THỊ EMAIL */}
    </div>
  );
}
