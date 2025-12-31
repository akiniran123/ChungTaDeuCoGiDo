"use client";

import { Edit3, Save, X, UserPlus, UserCheck } from "lucide-react";

export default function ProfileHeader({
  isEditing,
  onEdit,
  onSave,
  onCancel,

  // 👇 thêm cho theo dõi
  isFollowing,
  onFollowToggle,
  isOwnProfile,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;

  isFollowing: boolean;
  onFollowToggle: () => void;
  isOwnProfile: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      {/* ===== TÊN + FOLLOW ===== */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Hồ sơ cá nhân</h2>

        {!isOwnProfile && (
          <button
            onClick={onFollowToggle}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 cursor-pointer
              ${
                isFollowing
                  ? "border text-gray-700 hover:bg-gray-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            {isFollowing ? (
              <>
                <UserCheck size={16} /> Đang theo dõi
              </>
            ) : (
              <>
                <UserPlus size={16} /> Theo dõi
              </>
            )}
          </button>
        )}
      </div>

      {/* ===== PHẦN CHỈNH SỬA – GIỮ NGUYÊN ===== */}
      {isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1 cursor-pointer"
          >
            <Save size={16} /> Lưu
          </button>
          <button
            onClick={onCancel}
            className="border px-3 py-2 rounded-md text-sm flex items-center gap-1 cursor-pointer"
          >
            <X size={16} /> Hủy
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="border px-3 py-2 rounded-md text-sm flex items-center gap-1 cursor-pointer"
        >
          <Edit3 size={16} /> Chỉnh sửa
        </button>
      )}
    </div>
  );
}
