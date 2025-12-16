"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function AvatarUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Lấy user
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
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload avatar failed:", error.message);
      return;
    }

    // Lấy URL
    const { data } = supabase.storage
      .from("community-avatar-url")
      .getPublicUrl(filePath);

    const url = data.publicUrl;
    setPreview(url);
    onUploaded(url);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Ảnh đại diện</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border p-2 rounded"
      />

      {preview && (
        <Image
          src={preview}
          alt="Avatar Preview"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border"
          unoptimized
        />
      )}
    </div>
  );
}