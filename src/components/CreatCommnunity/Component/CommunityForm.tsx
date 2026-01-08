"use client";

import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Community = Database["public"]["Tables"]["communities"]["Row"];

type Props = {
  onCreated: (newCommunity: Community) => void;
};

export default function CommunityForm({ onCreated }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    members_count: 0,
    category: "",
    description: "",
    topics: "",
    online_count: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "members_count" || name === "online_count") {
      const numeric = value === "" ? 0 : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isNaN(numeric) ? 0 : numeric,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const newId = uuidv4();

      const { data, error } = await supabase
        .from("communities")
        .insert([
          {
            id: newId,
            ...formData,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error(error);
        setMessage("❌ Lỗi khi tạo cộng đồng!");
        setLoading(false);
        return;
      }

      // Lấy user hiện tại và thêm vào community_members nếu có
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && data && data[0]) {
        await supabase.from("community_members").insert([
          {
            id: uuidv4(),
            user_id: user.id,
            community_id: (data[0] as Community).id,
            role: "owner",
            joined_at: new Date().toISOString(),
          },
        ]);
      }

      setMessage("✅ Tạo cộng đồng thành công!");
      setFormData({
        title: "",
        members_count: 0,
        category: "",
        description: "",
        topics: "",
        online_count: 0,
      });

      if (data && data[0]) {
        onCreated(data[0] as Community);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi tạo cộng đồng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
      <div className="flex items-center justify-center mb-6">
        <Users className="w-8 h-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Tạo Cộng Đồng Mới
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Tên cộng đồng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Nhập tên cộng đồng..."
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Danh mục
            </label>
            <input
              type="text"
              name="category"
              placeholder="Ví dụ: Công nghệ, Thời trang..."
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Chủ đề
            </label>
            <input
              type="text"
              name="topics"
              placeholder="Ví dụ: AI, Lập trình, Web3..."
              value={formData.topics}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Mô tả</label>
          <textarea
            name="description"
            placeholder="Giới thiệu ngắn gọn về cộng đồng của bạn..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Số thành viên
            </label>
            <input
              type="number"
              name="members_count"
              value={formData.members_count}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Đang online
            </label>
            <input
              type="number"
              name="online_count"
              value={formData.online_count}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center border border-gray-300 text-gray-800 font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70 bg-transparent cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang tạo...
            </>
          ) : (
            "Tạo cộng đồng"
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-5 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}