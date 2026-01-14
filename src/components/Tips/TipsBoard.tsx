"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { TipCard, type CommunityTip } from "@/components/Tips/TipCard";
import { TipForm } from "@/components/Tips/TipForm";
import { Filter, Lightbulb } from "lucide-react";

// Danh mục cố định cho bộ lọc
const CATEGORIES = ["All", "Productivity", "Life Hack", "Learning"];

export const TipsBoard = () => {
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // 1. Hàm lấy dữ liệu từ Supabase
  const fetchTips = useCallback(async () => {
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi lấy dữ liệu mẹo:", error);
      return;
    }
    if (data) setTips(data as CommunityTip[]);
  }, []);

  // 2. Thiết lập Realtime và Fetch lần đầu
  useEffect(() => {
    fetchTips();

    const channel = supabase
      .channel("realtime_tips_board_main")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tips" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTips((current) => [payload.new as CommunityTip, ...current]);
          } else if (payload.eventType === "UPDATE") {
            const updatedTip = payload.new as CommunityTip;
            setTips((current) =>
              current.map((t) => (t.id === updatedTip.id ? updatedTip : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTips]);

  // 3. Logic lọc danh sách theo Category (Sử dụng useMemo để tối ưu)
  const filteredTips = useMemo(() => {
    if (activeCategory === "All") return tips;
    return tips.filter((tip) => tip.category === activeCategory);
  }, [tips, activeCategory]);

  // 4. Xử lý gửi Form thêm mẹo mới
  const handleAddTip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const newTipData = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as string,
        username: userData.user?.user_metadata?.full_name || "Guest",
        user_id: userData.user?.id || null,
        upvotes: 0,
      };

      const { error } = await supabase.from("tips").insert([newTipData]);
      if (error) throw error;
      
      form.reset();
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Đã có lỗi xảy ra khi chia sẻ mẹo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-2 md:p-6 space-y-12">
      {/* Tiêu đề Section */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
          <Lightbulb className="text-blue-600 w-6 h-6" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
          Community Tips
        </h2>
        <p className="text-slate-500 font-medium italic">Chia sẻ kiến thức, cùng nhau tiến bộ mỗi ngày.</p>
      </header>

      {/* Form nhập liệu */}
      <div className="max-w-2xl mx-auto shadow-sm">
        <TipForm onSubmit={handleAddTip} loading={loading} />
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
      </div>

      {/* Thanh bộ lọc (Filter Bar) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-widest">
          <Filter className="w-4 h-4" />
          Lọc theo:
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách hiển thị Card */}
      {filteredTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-lg">
            Hiện chưa có mẹo nào trong danh mục &quot;{activeCategory}&quot;.
          </p>
          <button 
            onClick={() => setActiveCategory("All")}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Xem tất cả các mẹo
          </button>
        </div>
      )}
    </section>
  );
};