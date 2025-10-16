"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Info, HelpCircle, Users, Link2, Folder } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Category = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

type SidebarLeftProps = {
  categories: Category[];
};

export default function SidebarLeft({ categories }: SidebarLeftProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [communities, setCommunities] = useState<{ id: string; title: string | null }[]>([]);

  const handleToggle = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const getIcon = (label: string) => {
    switch (label) {
      case "Về chúng tôi":
        return <Info className="w-4 h-4 inline-block mr-2 text-black" />;
      case "Hỗ trợ":
        return <HelpCircle className="w-4 h-4 inline-block mr-2 text-black" />;
      case "Cộng đồng":
        return <Users className="w-4 h-4 inline-block mr-2 text-black" />;
      case "Kết nối":
        return <Link2 className="w-4 h-4 inline-block mr-2 text-black" />;
      default:
        return <Folder className="w-4 h-4 inline-block mr-2 text-black" />;
    }
  };

  const isSpecialCategory = (label: string) =>
    ["Về chúng tôi", "Hỗ trợ", "Cộng đồng", "Kết nối"].includes(label);

  // 🧠 Lấy danh sách cộng đồng từ Supabase
  useEffect(() => {
    async function fetchCommunities() {
      const { data, error } = await supabase
        .from("communities")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải communities:", error);
      } else {
        setCommunities(data || []);
      }
    }

    fetchCommunities();
  }, []);

  // ✅ Chèn communities vào danh mục "Cộng đồng"
  const categoriesWithCommunities = categories.map((cat) =>
    cat.label === "Cộng đồng"
      ? {
          ...cat,
          children: [
            ...(cat.children || []),
            ...communities.map((c) => ({
              label: c.title || "Không tên",
              href: `/communities/${c.id}`,
            })),
            { label: "+ Tạo cộng đồng", href: "/create-community" },
          ],
        }
      : cat
  );

  return (
    <div className="h-[calc(100vh-5rem)] overflow-y-auto px-2 pb-20">
      <div className="flex flex-col mb-3">
        <Link
          href="/"
          className="font-bold text-xl flex items-center mb-2 px-2 py-1 rounded-lg !text-gray-800 no-underline hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5 mr-2 text-gray-800" />
          Trang chủ
        </Link>
        <h3 className="font-bold text-lg text-pink-600 px-2">Danh mục</h3>
      </div>

      <ul className="space-y-2 pb-20">
        {categoriesWithCommunities.map((cat) => (
          <li key={cat.label}>
            {cat.label === "Về chúng tôi" && (
              <hr className="my-2 border-t border-gray-300 border-[1.5px]" />
            )}

            {cat.children ? (
              <>
                <button
                  onClick={() => handleToggle(cat.label)}
                  className="w-full flex items-center text-left px-3 py-2 rounded-lg font-semibold !text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  {getIcon(cat.label)}
                  {cat.label}
                </button>
                {openMenu === cat.label && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {cat.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block w-full text-left px-3 py-1.5 rounded-md text-sm cursor-pointer no-underline ${
                            isSpecialCategory(cat.label)
                              ? "!text-gray-500 hover:!text-gray-700 hover:bg-gray-100"
                              : "!text-gray-600 hover:!text-pink-600 hover:bg-pink-50"
                          } transition-colors`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={cat.href!}
                className="flex items-center w-full text-left px-3 py-2 rounded-lg !text-gray-800 no-underline hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer"
              >
                {getIcon(cat.label)}
                {cat.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
