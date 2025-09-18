"use client";
import { useRouter } from "next/router";
import { sampleDeals } from "@/data/data";
import DealCard from "@/components/Trang_chu/DealCard";
import React from "react";

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") {
    return <div className="p-6 text-gray-500">Đang tải...</div>;
  }

  // Lọc sản phẩm theo user
  const userDeals = sampleDeals.filter((d) => d.author === username);

  if (userDeals.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-pink-600">👤 {username}</h1>
        <p className="text-gray-600 mt-2">
          Người dùng này chưa đăng sản phẩm nào.
        </p>
      </div>
    );
  }

  const userInfo = {
    name: username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    joinDate: userDeals[0].createdAt || "2024-01-15",
    bio: "Người dùng yêu thích mua sắm, chuyên đăng deal hot cho cộng đồng.",
    totalDeals: userDeals.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Thông tin người dùng */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-6">
        <div className="flex items-center gap-6">
          <img
            src={userInfo.avatar}
            alt={userInfo.name}
            className="w-24 h-24 rounded-full border shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-pink-600">{userInfo.name}</h1>
            <p className="text-gray-600">{userInfo.bio}</p>
            <div className="flex gap-6 mt-2 text-sm text-gray-500">
              <span>Tham gia: {new Date(userInfo.joinDate).toLocaleDateString("vi-VN")}</span>
              <span>Đã đăng: {userInfo.totalDeals} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Sản phẩm đã đăng
        </h2>

        <div className="space-y-6">
          {userDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              vote={() => {}}
              setSelectedDeal={() => {}}
              onImageClick={() => {}}
              bigger
            />
          ))}
        </div>
      </div>
    </div>
  );
}
