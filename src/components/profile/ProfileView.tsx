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
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <ProfileHeader
        isEditing={isEditing}
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isFollowing={isFollowing}
        onFollowToggle={toggleFollow}
      />

      {/* ===== BANNER + AVATAR (GÓC DƯỚI TRÁI) ===== */}
      <div className="relative mt-6">
        {/* BANNER */}
        <div className="h-48 w-full overflow-hidden rounded-xl">
          <ProfileBanner bannerUrl={null} />
        </div>

        {/* AVATAR + NAME - GÓC DƯỚI TRÁI */}
        <div className="absolute left-6 bottom-0 translate-y-1/2 z-10">
          <ProfileAvatar user={user} avatarUrl={formData.avatar_url} />
        </div>
      </div>

      {/* chừa khoảng trống vì avatar đè ra ngoài banner */}
      <div className="h-20" />

      <ProfileForm
        isEditing={isEditing && isOwnProfile}
        user={user}
        formData={formData}
        setFormData={setFormData}
      />

      
    </div>
  );
}
