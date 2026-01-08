"use client";

import { Users } from "lucide-react";
import type { Database } from "@/types/supabase";
import CommunityCard from "./CommunityCard";

type Community = Database["public"]["Tables"]["communities"]["Row"];

type Props = {
  communities: Community[];
  onOpen: (id: string) => void;
};

export default function CommunityList({ communities, onOpen }: Props) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
        <Users className="w-6 h-6 text-blue-600 mr-2" />
        Cộng đồng đã tạo
      </h2>

      {communities.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có cộng đồng nào.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {communities.map((c) => (
            <CommunityCard key={c.id} c={c} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}