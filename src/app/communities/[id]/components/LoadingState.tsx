"use client";

import { Loader2 } from "lucide-react";

export default function LoadingState({
  message = "Đang tải dữ liệu...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[200px] items-center justify-center text-gray-600">
      <Loader2 className="animate-spin w-6 h-6 text-indigo-500 mr-2" />
      {message}
    </div>
  );
}
