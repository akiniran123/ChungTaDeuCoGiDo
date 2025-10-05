import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { newsData } from "../data";

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = newsData.find((n) => n.slug === params.slug);
  if (!article) return notFound();

  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <Link
          href="/tin-tuc"
          className="text-[#9b4de0] text-sm font-medium hover:underline"
        >
          ← Quay lại danh sách tin tức
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
          {article.title}
        </h1>
        <p className="text-gray-500 mb-6">{article.description}</p>

        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-10 border-t pt-4 text-sm text-gray-500">
          © 2026 Công ty của bạn — Mọi quyền được bảo lưu.
        </div>
      </div>
    </div>
  );
}
