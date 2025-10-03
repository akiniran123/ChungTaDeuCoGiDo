"use client";

import { useParams } from "next/navigation";
import { sampleDeals } from "@/data/data";
import { MessageSquare, ThumbsUp, User } from "lucide-react";

export default function DealDetailPage() {
  const { id } = useParams();
  const deal = sampleDeals.find((d) => String(d.id) === String(id));

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        ❌ Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Khung chính */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold mb-6">{deal.title}</h1>

          {/* Ảnh chính */}
          <div className="w-full mb-6">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full max-h-[480px] object-cover rounded-xl shadow"
            />
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {deal.media.map((m, idx) => (
              <img
                key={idx}
                src={m}
                alt={`${deal.title}-${idx}`}
                className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition"
              />
            ))}
          </div>

          {/* Nội dung */}
          <div className="prose max-w-none mb-8">
            <p className="text-lg leading-relaxed">{deal.content}</p>
          </div>

          {/* Thông tin phụ */}
          <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span>Tác giả: <strong>{deal.author}</strong></span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{deal.votes} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{deal.comments} bình luận</span>
              </div>
              <div className="text-gray-500">{deal.category}</div>
            </div>
          </div>
        </div>

        {/* Bình luận */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

          {/* Form bình luận */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Viết bình luận..."
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
              Gửi
            </button>
          </div>

          {/* Danh sách bình luận (fake data để demo) */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nam"
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Nam</p>
                <p className="text-gray-700">
                  Deal này ngon quá, mình vừa mua luôn 🔥
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lan"
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Lan</p>
                <p className="text-gray-700">
                  Có freeship không vậy mọi người?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
