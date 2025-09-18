"use client";
import { useParams } from "next/navigation";
import { users, sampleDeals } from "@/data/data";

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const user = users.find(
    (u) => u.name.toLowerCase() === username.toLowerCase()
  );

  const userDeals = sampleDeals.filter((deal) => deal.author === user?.name);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Người dùng không tồn tại
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Thông tin user */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-pink-600">{user.name}</h1>
            <p className="text-gray-600">{user.bio}</p>
            <div className="flex gap-6 mt-2 text-sm text-gray-500">
              <span>Tham gia: {user.joinDate}</span>
              <span>Đã đăng: {userDeals.length} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Sản phẩm đã đăng
        </h2>
        {userDeals.length > 0 ? (
          <div className="space-y-6">
            {userDeals.map((deal) => (
              <div key={deal.id} className="p-4 bg-white rounded shadow">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full rounded mb-2"
                />
                <h3 className="font-semibold">{deal.title}</h3>
                <p className="text-gray-500 text-sm">{deal.createdAt}</p>
                <p>{deal.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Người dùng này chưa đăng sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
}
