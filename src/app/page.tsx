"use client";

import React, { useEffect, useState } from "react";
import { Lightbulb, Send, StickyNote } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/types/supabase";

// Sử dụng Type chuẩn từ database để đồng bộ hoàn toàn
type Note = Tables<"notes">;

export default function SharedNoteBoardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Tải ghi chú ban đầu & Lắng nghe Realtime
  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Lỗi lấy notes:", error);
        return;
      }
      
      if (data) setNotes(data as Note[]);
    };

    fetchNotes();

    // Lắng nghe thay đổi thời gian thực
    const channel = supabase
      .channel("public:notes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notes" },
        (payload) => {
          // Ép kiểu payload mới về Note để tránh lỗi type 'null'
          const newIncomingNote = payload.new as Note;
          setNotes((prev) => [newIncomingNote, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Hàm gửi ghi chú mới
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const colors = ["#fff9c4", "#ffecb3", "#dcedc8", "#e1f5fe"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const { error } = await supabase.from("notes").insert([
        {
          content: newNote,
          username: userData.user?.user_metadata?.full_name || "Người dùng ẩn danh",
          user_id: userData.user?.id || null,
          color: randomColor,
        },
      ]);

      if (error) throw error;
      setNewNote("");
    } catch (err) {
      console.error("Lỗi gửi note:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      {/* 1. Header Banner */}
      <header className="bg-[#1d72f2] text-white p-6 md:p-10 rounded-sm shadow-md text-center">
        <h1 className="text-lg md:text-2xl font-serif italic">
          &quot;Our Shared Wisdom Board&quot;
        </h1>
        <p className="text-xs mt-2 opacity-70 italic">Mọi người cùng viết, mọi người cùng xem</p>
      </header>

      {/* 2. Form viết Note */}
      <section className="bg-white p-6 rounded-xl border-2 border-dashed border-blue-200 shadow-sm">
        <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            maxLength={200}
            placeholder="Chia sẻ suy nghĩ của bạn (tối đa 200 ký tự)..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            type="submit"
            disabled={loading || !newNote.trim()}
            className="bg-[#1d72f2] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            {loading ? "Đang gửi..." : "Đăng Note"}
          </button>
        </form>
      </section>

      {/* 3. Bảng Note Chung (Grid) */}
      <div className="min-h-[400px] border-2 border-red-800/10 p-4 md:p-8 rounded-2xl bg-gray-50/50">
        <div className="flex items-center gap-2 mb-6">
          <StickyNote className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">Public Board</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              // Fix lỗi: color có thể là null nên cần fallback giá trị mặc định
              style={{ backgroundColor: note.color || "#fff9c4" }}
              className="p-6 shadow-lg border border-black/5 min-h-[180px] flex flex-col transform transition-transform hover:scale-105 hover:-rotate-1 relative group"
            >
              <div className="absolute top-2 right-2 w-3 h-3 bg-black/10 rounded-full" />
              <p className="text-gray-800 font-medium leading-relaxed mb-4 break-words">
                {note.content}
              </p>
              <div className="mt-auto pt-2 border-t border-black/5">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  {/* Fix lỗi: username có thể là null */}
                  By: {note.username || "Người dùng ẩn danh"}
                </p>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-gray-400 italic">
              Chưa có ghi chú nào. Hãy là người đầu tiên viết gì đó!
            </div>
          )}
        </div>
      </div>

      {/* 4. Tips Section */}
      <div className="space-y-4 pt-4 border-l-4 border-red-700/30 pl-6">
        <div className="bg-[#1d72f2] text-white px-10 py-2 w-fit rounded-full flex items-center gap-2 shadow-lg transform -translate-x-10">
          <Lightbulb className="w-6 h-6 fill-yellow-300 text-yellow-300" />
          <span className="font-black text-xl uppercase tracking-widest italic">Community Tips</span>
        </div>
        
        <div className="p-6 bg-blue-50 border-l-[12px] border-blue-400 rounded-lg shadow-sm">
          <p className="text-blue-800 font-medium italic">
            &quot;Sự thấu cảm bắt đầu từ việc lắng nghe những chia sẻ nhỏ nhất.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}