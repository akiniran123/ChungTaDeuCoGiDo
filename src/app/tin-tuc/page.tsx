import Link from "next/link";
import Image from "next/image";
import { newsData } from "./data";

export default function NewsPage() {
  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <Link
            key={news.slug}
            href={`/tin-tuc/${news.slug}`}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-4"
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image src={news.image} alt={news.title} fill className="object-cover" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{news.title}</h2>
            <p className="text-sm text-gray-500 mt-2">{news.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
