"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ToggleFooterSection({
  title,
  items,
  className = "",
}: {
  title: string;
  items: { label: string; href: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`space-y-1 text-right min-w-0 ${className}`}>
      <button
        className="font-semibold mb-2 w-full text-right hover:text-pink-600 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {title}
      </button>
      {open && (
        <div className="flex flex-col gap-1 pr-2 break-words max-w-full">
          {items.map(({ label, href }, i) => {
            const isExternal =
              href.startsWith("http") || href.startsWith("mailto:");
            return isExternal ? (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 transition-colors text-sm text-right break-words"
              >
                {label}
              </a>
            ) : (
              <Link
                key={i}
                href={href}
                className="text-gray-600 hover:text-pink-500 transition-colors text-sm text-right break-words"
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}