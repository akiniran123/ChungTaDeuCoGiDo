import Link from "next/link";
import Image from "next/image";
import type { Database } from "@/types/supabase";

// Định nghĩa lại type ở đây hoặc import từ file types chung
type Community = Database["public"]["Tables"]["communities"]["Row"];

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/communities/${community.id}`}
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition block group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
          {community.avatar_url ? (
            <Image
              src={community.avatar_url}
              alt={community.title || "Community Avatar"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-blue-600 font-bold text-lg">
              {community.title ? community.title.charAt(0).toUpperCase() : "C"}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
            {community.title || "Không tên"}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {community.description || "Chưa có mô tả."}
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="bg-gray-100 px-2 py-0.5 rounded">{community.category || "Khác"}</span>
            <span>·</span>
            <span>👥 {community.members_count ?? 0}</span>
            <span>·</span>
            <span className="text-green-600">🟢 {community.online_count ?? 0} online</span>
          </div>
        </div>
      </div>
    </Link>
  );
}