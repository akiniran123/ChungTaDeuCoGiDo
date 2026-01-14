"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { TipCard, type CommunityTip } from "@/components/Tips/TipCard";
import { TipForm } from "@/components/Tips/TipForm";
import { Filter, Lightbulb } from "lucide-react";

const CATEGORIES = ["All", "Productivity", "Life Hack", "Learning"];

export const TipsBoard = () => {
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // 1. Hàm lấy dữ liệu ban đầu
  const fetchTips = useCallback(async () => {
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("created_at", { ascending: false }); // Sắp xếp mới nhất lên đầu để dễ thấy Realtime

    if (error) {
      console.error("Lỗi lấy dữ liệu mẹo:", error);
      return;
    }
    if (data) setTips(data as CommunityTip[]);
  }, []);

  // 2. Thiết lập Realtime
  useEffect(() => {
    fetchTips();

    const channel = supabase
      .channel("tips_realtime_board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tips" },
        (payload) => {
          console.log("Change received!", payload);

          if (payload.eventType === "INSERT") {
            const newTip = payload.new as CommunityTip;
            setTips((current) => {
              // Kiểm tra tránh trùng lặp id
              if (current.some((t) => t.id === newTip.id)) return current;
              return [newTip, ...current];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedTip = payload.new as CommunityTip;
            setTips((current) =>
              current.map((t) => (t.id === updatedTip.id ? updatedTip : t))
            );
          } else if (payload.eventType === "DELETE") {
            setTips((current) => current.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTips]);

  // 3. Logic lọc dữ liệu
  const filteredTips = useMemo(() => {
    if (activeCategory === "All") return tips;
    return tips.filter((tip) => tip.category === activeCategory);
  }, [tips, activeCategory]);

  // 4. Xử lý thêm mẹo mới
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
        username: userData.user?.user_metadata?.full_name || "Thành viên ẩn danh",
        user_id: userData.user?.id || null,
        upvotes: 0,
      };

      const { error } = await supabase.from("tips").insert([newTipData]);
      if (error) throw error;
      
      // Không cần setTips thủ công ở đây vì Realtime sẽ lo việc đó
      form.reset();
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Lỗi khi gửi mẹo. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-2 md:p-6 space-y-12 bg-transparent">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-3xl mb-2 animate-bounce">
          <Lightbulb className="text-blue-500 w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
          Community Tips
        </h2>
        <p className="text-slate-500 font-medium italic italic">
          &quot;Kiến thức chỉ có giá trị khi được sẻ chia.&quot;
        </p>
      </header>

      {/* Form Area */}
      <div className="max-w-2xl mx-auto">
        <TipForm onSubmit={handleAddTip} loading={loading} />
      </div>

      <hr className="border-slate-200 w-1/2 mx-auto" />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
          <Filter className="w-3 h-3" />
          Phân loại mẹo:
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-2xl text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                  : "bg-white text-slate-500 border border-slate-100 hover:border-blue-300 hover:text-blue-600 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh sách */}
      {filteredTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TipCard tip={tip} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <p className="text-slate-400 font-medium text-lg">
            Danh mục &quot;{activeCategory}&quot; chưa có mẹo nào.
          </p>
          <button 
            onClick={() => setActiveCategory("All")}
            className="mt-4 text-blue-500 font-bold hover:text-blue-700 transition-colors"
          >
            Quay lại xem tất cả
          </button>
        </div>
      )}
    </section>
  );
};