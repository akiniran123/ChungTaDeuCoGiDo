"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateCommunityPage() {
  const router = useRouter();

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
  const [communities, setCommunities] = useState<any[]>([]);

  // Lấy danh sách cộng đồng từ Supabase
  useEffect(() => {
    const fetchCommunities = async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải danh sách cộng đồng:", error);
      } else {
        setCommunities(data || []);
      }
    };

    fetchCommunities();
  }, []);

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

    // ⭐⭐⭐ THÊM BẠN VÀO COMMUNITY_MEMBERS VỚI ROLE OWNER ⭐⭐⭐
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && data && data[0]) {
      await supabase.from("community_members").insert([
        {
          id: uuidv4(),
          user_id: user.id,
          community_id: data[0].id,
          role: "owner",
          joined_at: new Date().toISOString(),
        },
      ]);
    }
    // ⭐⭐⭐ END ⭐⭐⭐

    setMessage("✅ Tạo cộng đồng thành công!");
    setFormData({
      title: "",
      members_count: 0,
      category: "",
      description: "",
      topics: "",
      online_count: 0,
    });

    setCommunities((prev) => [data[0], ...prev]);

    setLoading(false);
  };

  const handleOpenCommunity = (id: string) => {
    router.push(`/community/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-start px-4 py-10">
      {/* FORM TẠO CỘNG ĐỒNG */}
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

          {/* NÚT TRUNG TÍNH CÓ CURSOR POINTER */}
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

      {/* DANH MỤC CỘNG ĐỒNG ĐÃ TẠO */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          Cộng đồng đã tạo
        </h2>

        {communities.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có cộng đồng nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {communities.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenCommunity(c.id)}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{c.category}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                  {c.description || "Chưa có mô tả."}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  👥 {c.members_count} thành viên • 🟢 {c.online_count} online
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
