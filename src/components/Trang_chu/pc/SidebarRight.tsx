"use client";
import React, { useEffect, useState } from "react";
import UserMenu from "@/components/Navbar/pc/LogoSearchIcon/UserMenu";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

interface SidebarRightCardProps {
  selectedCategory: string | null;
}

export default function SidebarRightCard({ selectedCategory }: SidebarRightCardProps) {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const loadCommunities = async () => {
      if (!selectedCategory) return;
      const { data } = await supabase
        .from("communities")
        .select("*")
        .eq("category", selectedCategory)
        .limit(5);
      setCommunities(data ?? []);
    };
    loadCommunities();
  }, [selectedCategory]);

  return (
    <aside className="fixed top-[10px] right-[10px] z-30 w-[260px] h-[calc(100vh-20px)]">
      <div className="h-full rounded-4xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* UserMenu */}
        <div className="p-4 border-b border-gray-200">
          <UserMenu onLoginClick={() => console.log("Login clicked")} />
        </div>

        {/* Gợi ý cộng đồng */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-semibold mb-2">Cộng đồng liên quan</h3>
          {selectedCategory ? (
            communities.length > 0 ? (
              <ul className="space-y-2">
                {communities.map((c) => (
                  <li key={c.id} className="p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-gray-800">{c.title}</div>
                    <div className="text-xs text-gray-500">
                      👥 {c.members_count ?? 0} thành viên
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">Không có gợi ý cho mục này</p>
            )
          ) : (
            <p className="text-xs text-gray-400">Chọn một category để xem gợi ý</p>
          )}
        </div>
      </div>
    </aside>
  );
}