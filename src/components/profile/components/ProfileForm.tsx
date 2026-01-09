"use client";

import React from "react";

/* ================== TYPES ================== */
export type UserData = {
  username?: string | null;
  avatar_url?: string | null;
  address?: string | null;
  phone?: string | null;
  birth?: string | null;
};

export type ProfileFormData = {
  username: string;
  avatar_url: string;
  address: string;
  phone: string;
  birth: string;
};

/* ================== COMPONENT ================== */
export default function ProfileForm({
  isEditing,
  user,
  formData,
  setFormData,
}: {
  isEditing: boolean;
  user: UserData;
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}) {
  if (!isEditing) {
    return (
      <div className="mt-6 space-y-2 text-sm">
        <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
        <p><strong>SĐT:</strong> {user.phone || "Chưa có"}</p>
        <p><strong>Ngày sinh:</strong> {user.birth || "Chưa cập nhật"}</p>
      </div>
    );
  }

  const fields: Record<keyof ProfileFormData, string> = {
    username: "Tên người dùng",
    avatar_url: "Avatar URL",
    address: "Địa chỉ",
    phone: "Số điện thoại",
    birth: "Ngày sinh",
  };

  return (
    <div className="mt-6 space-y-4">
      {Object.entries(fields).map(([key, label]) => {
        const typedKey = key as keyof ProfileFormData;
        const isBirth = key === "birth";

        return (
          <div key={key}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type={isBirth ? "date" : "text"}
              value={formData[typedKey]}
              onChange={(e) =>
                setFormData((prev: ProfileFormData) => ({
                  ...prev,
                  [typedKey]: e.target.value,
                }))
              }
              className={`w-full border rounded-md p-2 text-sm ${
                isBirth
                  ? "[&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
