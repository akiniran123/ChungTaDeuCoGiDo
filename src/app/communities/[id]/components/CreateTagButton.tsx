"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";

export default function CreateTagButton({ communityId }: { communityId: string }) {
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleCreateTag = async () => {
    if (!tagName.trim()) return;

    setLoading(true);
    setSuccess("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User chưa đăng nhập");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("community_tags").insert({
      name: tagName,
      community_id: communityId,
      created_by: user.id,
    });

    setLoading(false);

    if (error) {
      console.error("Lỗi tạo tag:", error);
      return;
    }

    setSuccess("Tạo tag thành công!");
    setTagName("");

    setTimeout(() => {
      setSuccess("");
      setOpen(false);
    }, 1000);
  };

  return (
    <>
      {/* 🔥 NÚT TẠO TAG — TRUNG TÍNH + CURSOR-POINTER */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 
                   hover:bg-gray-200 transition cursor-pointer"
      >
        <Plus size={18} />
        Tạo Tag
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[360px]">
            <h2 className="text-lg font-semibold mb-4">Tạo Tag mới</h2>

            <input
              type="text"
              placeholder="Tên tag..."
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            />

            {success && (
              <p className="text-green-600 mt-2 text-sm">{success}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg border hover:bg-neutral-100 transition cursor-pointer"
              >
                Hủy
              </button>

              <button
                onClick={handleCreateTag}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Tạo Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
