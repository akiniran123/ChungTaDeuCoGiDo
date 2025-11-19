"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

// =============================================================
// 🚀 COMPONENT UPLOAD AVATAR
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
      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

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

  // ⭐ THÊM: State modal xem ảnh
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 🔥 CHECK OWNER
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      const { data: member } = await supabase
        .from("community_members")
        .select("role")
        .eq("community_id", id)
        .eq("user_id", userId)
        .single();

      if (member?.role === "owner") {
        setIsOwner(true);
      }
    };

    fetchRole();
  }, [id]);

  // ========== STATE CHỈNH TÊN ==========
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || "");
  const [savingTitle, setSavingTitle] = useState(false);

  async function saveTitle() {
    if (!localTitle.trim()) return;

    setSavingTitle(true);

    await supabase.from("communities").update({ title: localTitle }).eq("id", id);

    setSavingTitle(false);
    setEditingTitle(false);
  }

  // ========== Upload Banner ==========
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
        await supabase.storage
          .from("community-banners")
          .remove([`${oldFolder}/${oldFile}`]);
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
    <>
      <header className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

        {/* BANNER */}
        <div
          className="relative w-full h-36 bg-gray-200 cursor-zoom-in"
          onClick={() => localBanner && setPreviewImage(localBanner)}
        >
          {localBanner ? (
            <img src={localBanner} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-50 to-white" />
          )}

          {isOwner && (
            <>
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
            </>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">

          {/* AVATAR */}
          <div className="relative flex flex-col items-start">
            {localAvatar ? (
              <img
                src={localAvatar}
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border cursor-zoom-in"
                onClick={() => setPreviewImage(localAvatar)}
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold">
                {title?.charAt(0).toUpperCase() ?? "C"}
              </div>
            )}

            {isOwner && (
              <AvatarUploader
                onUploaded={async (url) => {
                  await supabase
                    .from("communities")
                    .update({ avatar_url: url })
                    .eq("id", id);

                  setLocalAvatar(url);
                }}
              />
            )}
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">

            {/* TITLE */}
            <div className="flex items-center gap-2">

              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                    className="border px-3 py-1 rounded-lg text-lg md:text-2xl font-bold"
                  />

                  {savingTitle ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  ) : (
                    <Check
                      className="w-5 h-5 text-green-600 cursor-pointer"
                      onClick={saveTitle}
                    />
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate">
                    {localTitle}
                  </h1>

                  {isOwner && (
                    <button
                      className="p-2 bg-white rounded-full shadow hover:bg-gray-100 cursor-pointer"
                      onClick={() => setEditingTitle(true)}
                    >
                      <Pencil className="w-4 h-4 text-gray-700" />
                    </button>
                  )}
                </>
              )}
            </div>

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

      {/* ⭐ MODAL XEM ẢNH PHÓNG TO */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>

            <img
              src={previewImage}
              className="w-full h-full object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
