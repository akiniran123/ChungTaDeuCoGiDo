"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

// =============================================================
// 🚀 COMPONENT UPLOAD AVATAR (ICON BÚT TRÊN GÓC PHẢI)
// =============================================================
function AvatarUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileName = `avatar-${Date.now()}-${file.name}`;
    const filePath = `user_${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("community-avatar-url")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload avatar failed:", error.message);
      return;
    }

    const { data } = supabase.storage
      .from("community-avatar-url")
      .getPublicUrl(filePath);

    onUploaded(data.publicUrl);
  };

  return (
    <>
      {/* input upload ảnh (ẩn) */}
      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {/* ICON BÚT: GÓC TRÊN BÊN PHẢI */}
      <label
        htmlFor="avatarInput"
        className="
          absolute 
          top-0 right-0 
          translate-x-1 -translate-y-1
          p-2 bg-white shadow-md 
          rounded-full hover:bg-gray-100 cursor-pointer
        "
      >
        <Pencil className="w-4 h-4 text-gray-700" />
      </label>
    </>
  );
}

// =============================================================
// 🚀 COMMUNITY HEADER
// =============================================================
export default function CommunityHeader({ community }: { community: Community }) {
  const {
    id,
    title,
    description,
    category,
    members_count,
    online_count,
    avatar_url,
    banner_url,
  } = community;

  const [uploading, setUploading] = useState<"banner" | null>(null);
  const [localAvatar, setLocalAvatar] = useState(avatar_url);
  const [localBanner, setLocalBanner] = useState(banner_url);

  // Upload Banner giữ nguyên
  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading("banner");

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${id}/${fileName}`;

    if (localBanner) {
      try {
        const parts = localBanner.split("/");
        const oldFolder = parts[parts.length - 2];
        const oldFile = parts[parts.length - 1];
        await supabase.storage.from("community-banners").remove([`${oldFolder}/${oldFile}`]);
      } catch {}
    }

    const { error } = await supabase.storage
      .from("community-banners")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload banner failed");
      setUploading(null);
      return;
    }

    const { data } = supabase.storage
      .from("community-banners")
      .getPublicUrl(filePath);

    await supabase
      .from("communities")
      .update({ banner_url: data.publicUrl })
      .eq("id", id);

    setLocalBanner(data.publicUrl);
    setUploading(null);
  }

  return (
    <header className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

      {/* BANNER */}
      <div className="relative w-full h-36 bg-gray-200">
        {localBanner ? (
          <img src={localBanner} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-50 to-white" />
        )}

        <input
          id="bannerInput"
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="hidden"
        />

        <label
          htmlFor="bannerInput"
          className="absolute top-2 right-2 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 cursor-pointer"
        >
          {uploading === "banner" ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          ) : (
            <Pencil className="w-4 h-4 text-gray-700" />
          )}
        </label>
      </div>

      {/* CONTENT */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">

        {/* AVATAR */}
        <div className="relative flex flex-col items-start">
          {localAvatar ? (
            <img
              src={localAvatar}
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {title?.charAt(0).toUpperCase() ?? "C"}
            </div>
          )}

          <AvatarUploader
            onUploaded={async (url) => {
              await supabase
                .from("communities")
                .update({ avatar_url: url })
                .eq("id", id);

              setLocalAvatar(url);
            }}
          />
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate">
            {title ?? "Cộng đồng không tên"}
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-600 line-clamp-3">
            {description ?? "Chưa có mô tả cho cộng đồng này."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <strong>{category ?? "Khác"}</strong>
            <span className="text-gray-400">·</span>
            <span>👥 {members_count ?? 0} thành viên</span>
            <span className="text-gray-400">·</span>
            <span>🟢 {online_count ?? 0} đang online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
