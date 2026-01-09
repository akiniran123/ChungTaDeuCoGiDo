"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileData } from "./hooks/useProfileData";

import ProfileHeader from "@/components/profile/components/ProfileHeader";
import ProfileBanner from "@/components/profile/components/ProfileBanner";
import ProfileAvatar from "@/components/profile/components/ProfileAvatar";
import ProfileForm from "@/components/profile/components/ProfileForm";
import UserProducts from "@/components/profile/components/UserProducts";

export default function ProfileView({ profileId }: { profileId: string }) {
  const router = useRouter();
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
    currentUser,
  } = useProfileData(profileId);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!user)
    return <p className="text-center py-20">Không tìm thấy người dùng</p>;

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

      {/* ✅ PROFILE BANNER – ĐÚNG PROPS */}
      <ProfileBanner bannerUrl={null} />

      <ProfileAvatar user={user} avatarUrl={formData.avatar_url} />

      <ProfileForm
        isEditing={isEditing && isOwnProfile}
        user={user}
        formData={formData}
        setFormData={setFormData}
      />

      <UserProducts
        products={userProducts}
        loading={false}
        user={user}
        currentUser={currentUser}
        router={router}
        deleting={deleting}
        onDelete={(productId, imageUrl) => {
          if (confirm("Xóa sản phẩm này?")) {
            console.log("Xóa:", productId);
          }
        }}
      />
    </div>
  );
}
