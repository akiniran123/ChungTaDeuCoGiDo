'use client';

import React from "react";

interface CategoryHeaderProps {
  title: string;
  subtitle?: string;
}

export default function CategoryHeader({ title, subtitle }: CategoryHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
