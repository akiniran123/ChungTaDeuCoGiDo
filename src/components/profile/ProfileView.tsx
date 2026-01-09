"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Thêm router để truyền vào component con
import { useProfileData } from "./hooks/useProfileData";
import ProfileHeader from "@/components/profile/components/ProfileHeader";
import ProfileAvatar from "@/components/profile/components/ProfileAvatar";
import ProfileForm from "@/components/profile/components/ProfileForm";
import UserProducts from "@/components/profile/components/UserProducts";

export default function ProfileView({ profileId }: { profileId: string }) {
  const router = useRouter(); // Khởi tạo router
  const [deleting, setDeleting] = useState<string | null>(null);

  const { 
    user, 
    userProducts, 
    loading, 
    isOwnProfile, 
    isFollowing,       
    toggleFollow,      
    formData,          
    setFormData,
    currentUser // Lấy thêm currentUser từ hook
  } = useProfileData(profileId);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setIsEditing(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!user) return <p className="text-center py-20">Không tìm thấy người dùng</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <ProfileHeader
        isEditing={isEditing}
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isFollowing={isFollowing}           
        onFollowToggle={toggleFollow}        
      />

      <ProfileAvatar user={user} avatarUrl={formData.avatar_url} />

      <ProfileForm
        isEditing={isEditing && isOwnProfile}
        user={user}
        formData={formData}                  
        setFormData={setFormData}
      />

      {/* Sửa lại phần này để khớp chính xác với Interface của UserProducts */}
      <UserProducts
        products={userProducts}
        loading={false}            // Prop yêu cầu
        user={user}                // Prop yêu cầu
        currentUser={currentUser}  // Prop yêu cầu
        router={router}            // Prop yêu cầu
        deleting={deleting}        // Prop yêu cầu
        onDelete={(productId, imageUrl) => { // Tham số yêu cầu đúng định dạng
          if(confirm("Xóa sản phẩm này?")) {
             // Gọi hàm xóa của bạn ở đây
             console.log("Xóa:", productId);
          }
        }}
      />
    </div>
  );
}