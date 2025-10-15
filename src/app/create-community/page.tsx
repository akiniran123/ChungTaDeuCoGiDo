"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Users } from "lucide-react";

export default function CreateCommunityPage() {
  const [formData, setFormData] = useState({
    title: "",
    members: 0,
    category: "",
    description: "",
    topics: "",
    online: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("communities").insert([
      {
        ...formData,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("❌ Lỗi khi tạo cộng đồng!");
    } else {
      setMessage("✅ Tạo cộng đồng thành công!");
      setFormData({
        title: "",
        members: 0,
        category: "",
        description: "",
        topics: "",
        online: 0,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
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
            <label className="block text-gray-700 font-semibold mb-1">
              Mô tả
            </label>
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
                name="members"
                value={formData.members}
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
                name="online"
                value={formData.online}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all disabled:opacity-70"
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
    </div>
  );
}
