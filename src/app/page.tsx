'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">🛠️ Build Your Dream PC</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Chọn linh kiện phù hợp, theo dõi giá, và chia sẻ cấu hình máy tính của bạn.
      </p>

      {/* ✅ Nút giống PCPartPicker */}
      <Link
        href="/list"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
      >
        🚀 Start Your Build
      </Link>
    </section>
  );
}
