"use client";
import React from "react";
import Link from "next/link";

export default function SidebarRight({
  communityMembers,
}: {
  communityMembers: {
    id: number;
    name: string;
    followers: number;
    stars: number;
  }[];
}) {
  return (
    <aside className="sticky top-32 self-start">
      {/* 👆 top-32 = 128px, tránh bị che bởi TopBar + Navbar */}
      <h3 className="font-bold text-lg mb-3 text-pink-600">Cộng đồng nổi bật</h3>
      <ul className="space-y-3">
        {communityMembers.map((member) => (
          <li
            key={member.id}
            className="flex flex-col gap-1 border-b pb-2 last:border-none"
          >
            <Link
              href={`/user/${member.id}`}
              className="font-semibold !text-gray-800 hover:!text-pink-600 !no-underline"
            >
              {member.name}
            </Link>
            <div className="text-xs text-gray-500">
              👥 {member.followers} người theo dõi
            </div>
            <div className="text-xs text-yellow-500">
              ⭐ {member.stars.toFixed(1)}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
