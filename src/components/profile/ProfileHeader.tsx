"use client";

import { Edit3, Save, X } from "lucide-react";

export default function ProfileHeader({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Hồ sơ cá nhân</h2>

      {isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1"
          >
            <Save size={16} /> Lưu
          </button>
          <button
            onClick={onCancel}
            className="border px-3 py-2 rounded-md text-sm flex items-center gap-1"
          >
            <X size={16} /> Hủy
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="border px-3 py-2 rounded-md text-sm flex items-center gap-1"
        >
          <Edit3 size={16} /> Chỉnh sửa
        </button>
      )}
    </div>
  );
}
