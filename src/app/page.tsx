'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">🛠️ Build Your Dream PC</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Chọn linh kiện phù hợp, theo dõi giá, và chia sẻ cấu hình máy tính của bạn một cách dễ dàng.
      </p>
      <Link
        href="/list"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        🚀 Start Building
      </Link>
    </section>
  );
}
