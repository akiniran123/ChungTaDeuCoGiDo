"use client";
import React, { useState } from "react";
import Link from "next/link";

type Category = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export default function SidebarLeft({
  categories,
  setShowSidebar,
}: {
  categories: Category[];
  setShowSidebar: (value: boolean) => void;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleToggle = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <aside className="md:col-span-1 bg-white rounded-r-xl shadow-md p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-pink-600">Danh mục</h3>
      </div>
      <ul className="space-y-2">
        {categories.map((cat, i) => (
          <React.Fragment key={i}>
            {/* Đường ngang xám nhạt trước nhóm “Về chúng tôi” */}
            {cat.label === "Về chúng tôi" && (
              <hr className="border-t-2 border-gray-300 my-2" />
            )}

            <li>
              {cat.children ? (
                <>
                  <button
                    onClick={() => handleToggle(cat.label)}
                    className="w-full text-left px-3 py-2 rounded-lg font-semibold !text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    {cat.label}
                  </button>

                  {/* Submenu chỉ hiện khi cat được mở */}
                  {openMenu === cat.label && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {cat.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block w-full text-left px-3 py-1.5 rounded-md !text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm"
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
                  className="block w-full text-left px-3 py-2 rounded-lg !text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {cat.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
}

