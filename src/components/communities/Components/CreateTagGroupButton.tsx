// components/communities/CreateTagGroupButton.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  communityId: string;
  onCreated?: () => void;
}

export default function CreateTagGroupButton({
  communityId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setError(null);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Tên nhóm không được để trống.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        throw new Error("Không tìm thấy session. Vui lòng đăng nhập lại.");
      }

      const res = await fetch("/api/tag-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          community_id: communityId,
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Lỗi server");

      reset();
      setOpen(false);
      onCreated?.();
    } catch (err: unknown) {
      console.error("Create tag group error:", err);
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-blue-600 text-white rounded-md"
      >
        Tạo nhóm tag
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">
              Tạo nhóm tag mới
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Tên nhóm"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
              rows={3}
            />

            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="px-3 py-2 bg-gray-200 rounded"
                disabled={saving}
              >
                Huỷ
              </button>

              <button
                onClick={handleCreate}
                className="px-3 py-2 bg-blue-600 text-white rounded"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
