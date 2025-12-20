"use client";

import Image from "next/image";
import type { UserData } from "../../app/profile/page";

export default function ProfileAvatar({
  user,
  avatarUrl,
}: {
  user: UserData;
  avatarUrl: string;
}) {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="avatar"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-full h-full p-8 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-3">
        {user.username || "Người dùng"}
      </h2>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
}
