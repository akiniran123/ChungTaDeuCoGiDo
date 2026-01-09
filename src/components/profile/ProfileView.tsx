"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useProfileData } from "./hooks/useProfileData";
// Đảm bảo import đúng đường dẫn
import ProfileHeader from "@/components/profile/components/ProfileHeader";
import ProfileAvatar from "@/components/profile/components/ProfileAvatar";
import ProfileForm from "@/components/profile/components/ProfileForm";
import UserProducts from "@/components/profile/components/UserProducts";

export default function ProfileView({ profileId }: { profileId: string }) {
  // 1. Lấy đầy đủ các biến từ Hook (đã bỏ any ở hook trước đó)
  const { 
    user, 
    userProducts, 
    loading, 
    isOwnProfile, 
    isFollowing,       // Thêm cái này
    toggleFollow,      // Thêm cái này (tên hàm tùy bạn đặt ở hook)
    formData,          // Dùng formData từ hook thay vì tạo mới ở đây
    setFormData 
  } = useProfileData(profileId);

  const [isEditing, setIsEditing] = useState(false);

  // Hàm xử lý lưu (tạm thời)
  const handleSave = async () => {
    // Gọi logic lưu ở đây hoặc từ hook
    setIsEditing(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!user) return <p className="text-center py-20">Không tìm thấy người dùng</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      {/* 2. Truyền đầy đủ props vào ProfileHeader */}
      <ProfileHeader
        isEditing={isEditing}
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isFollowing={isFollowing}           // Truyền prop thiếu
        onFollowToggle={toggleFollow}        // Truyền prop thiếu
      />

      <ProfileAvatar user={user} avatarUrl={formData.avatar_url} />

      <ProfileForm
        isEditing={isEditing && isOwnProfile}
        user={user}
        formData={formData}                  // Dùng trực tiếp formData từ hook
        setFormData={setFormData}
      />

      {/* Lưu ý: Component UserProducts của bạn có thể cần thêm các props khác 
          như loading, currentUser, router, deleting tùy vào file gốc */}
      <UserProducts
        products={userProducts}
        user={user}
        isOwnProfile={isOwnProfile}
        onDelete={(id) => {
          if(confirm("Xóa sản phẩm này?")) {
             // Logic xóa
          }
        }}
      />
    </div>
  );
}