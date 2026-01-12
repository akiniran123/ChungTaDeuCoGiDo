"use client";

import React, { useEffect, useState, useRef } from "react";
import { Lightbulb, Send, StickyNote, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/types/supabase";

type Note = Tables<"notes">;

const NOTE_PALETTES = [
  { bg: "#fff9c4", text: "#5d4037" },
  { bg: "#ffecb3", text: "#4e342e" },
  { bg: "#dcedc8", text: "#33691e" },
  { bg: "#e1f5fe", text: "#01579b" },
  { bg: "#f8bbd0", text: "#880e4f" },
  { bg: "#e1bee7", text: "#4a148c" },
  { bg: "#ffe0b2", text: "#e65100" },
  { bg: "#cfd8dc", text: "#263238" },
];

export default function SharedNoteBoardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Logic ẩn/hiện thanh nhập note
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

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

    const channel = supabase
      .channel("public:notes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notes" }, (payload) => {
        setNotes((prev) => [payload.new as Note, ...prev]);
      })
      .subscribe();

    // Logic xử lý scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Kéo xuống -> Ẩn
        setIsVisible(false);
      } else {
        // Kéo lên -> Hiện
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const randomPalette = NOTE_PALETTES[Math.floor(Math.random() * NOTE_PALETTES.length)];

      const { error } = await supabase.from("notes").insert([
        {
          content: newNote,
          username: userData.user?.user_metadata?.full_name || "Người dùng ẩn danh",
          user_id: userData.user?.id || null,
          color: randomPalette.bg,
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

  const getNoteAppearance = (note: Note) => {
    const id = note.id;
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const heights = ["min-h-[160px]", "min-h-[200px]", "min-h-[180px]"];
    const hClass = heights[charCodeSum % heights.length];
    
    const rotates = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-0"];
    const rClass = rotates[charCodeSum % rotates.length];

    const spans = ["col-span-1", "col-span-1", "md:col-span-2", "col-span-1", "col-span-1"];
    const sClass = spans[charCodeSum % spans.length];

    const palette = NOTE_PALETTES.find(p => p.bg === note.color) || NOTE_PALETTES[0];
    const textColor = palette.text;

    return { classes: `${hClass} ${rClass} ${sClass}`, textColor };
  };

  return (
    <div className="w-full p-2 md:p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      
      {/* Header rực rỡ */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center group">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse" />
        <h1 className="relative text-3xl md:text-5xl font-serif italic font-black tracking-tight drop-shadow-lg">
          &quot;Our Shared Wisdom Board&quot;
        </h1>
        <div className="relative flex items-center justify-center gap-3 mt-4">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
          <p className="text-sm md:text-base opacity-90 font-bold tracking-[0.2em] uppercase">Góc nhỏ cộng đồng</p>
          <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
        </div>
      </header>

      {/* Input Section - Đã thêm logic trượt ẩn/hiện */}
      <section 
        className={`max-w-4xl mx-auto w-full backdrop-blur-md bg-white/70 p-6 rounded-3xl border border-white/50 shadow-2xl sticky top-4 z-30 ring-8 ring-blue-500/5 transition-all duration-500 transform ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            maxLength={300}
            placeholder="Chia sẻ suy nghĩ rực rỡ của bạn..."
            className="flex-1 bg-white/80 border-2 border-blue-50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-gray-800 shadow-inner min-h-[80px] text-base resize-none transition-all placeholder:italic"
          />
          <button
            type="submit"
            disabled={loading || !newNote.trim()}
            className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:shadow-indigo-500/40 transition-all active:scale-95 disabled:opacity-50 h-fit sm:self-end border-b-4 border-black/20"
          >
            <Send className="w-5 h-5" />
            {loading ? "..." : "DÁN LÊN"}
          </button>
        </form>
      </section>

      {/* Bảng Note */}
      <div className="min-h-[700px] h-auto border-[16px] border-white p-6 md:p-14 rounded-[4rem] bg-gradient-to-tr from-slate-50 via-white to-blue-50/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="flex items-center gap-4 mb-16 relative">
          <div className="p-3 bg-yellow-400 rounded-2xl shadow-xl rotate-12">
            <StickyNote className="w-8 h-8 text-white fill-white/20" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">The Wall</h2>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-yellow-400/60 to-transparent ml-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 grid-flow-row-dense relative">
          {notes.map((note) => {
            const { classes, textColor } = getNoteAppearance(note);
            return (
              <div
                key={note.id}
                style={{ 
                  backgroundColor: note.color || "#fff9c4",
                  color: textColor
                }}
                className={`p-7 shadow-[10px_10px_0px_rgba(0,0,0,0.03)] border-2 border-white/40 flex flex-col transform transition-all hover:scale-105 hover:-translate-y-2 hover:rotate-0 hover:z-20 cursor-default relative group rounded-xl ${classes}`}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-xl border-4 border-white z-10 hidden group-hover:block animate-bounce" />
                
                <p className="font-bold leading-relaxed mb-6 break-words text-lg font-serif italic">
                  &quot;{note.content}&quot;
                </p>
                
                <div className="mt-auto pt-4 border-t-2 border-black/5 flex flex-col">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-current opacity-60">
                    @{note.username?.split(' ').pop() || "anon"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-56 opacity-10">
            <StickyNote className="w-32 h-32 mb-8" />
            <p className="text-4xl font-black italic tracking-tighter uppercase">Chưa có gì ở đây...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 border-b-[10px] border-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="p-5 bg-yellow-400 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform cursor-pointer">
          <Lightbulb className="w-10 h-10 text-slate-900 fill-white" />
        </div>
        <div className="text-center md:text-left relative z-10">
          <h3 className="text-xl font-black uppercase tracking-widest text-yellow-400">Tư duy rực rỡ</h3>
          <p className="text-base italic font-medium opacity-80 mt-2 leading-relaxed">
            &quot;Sự khác biệt của bạn là một siêu năng lực. Hãy để thế giới chiêm ngưỡng nó qua những dòng chữ này.&quot;
          </p>
        </div>
      </footer>
      
      <div className="opacity-40 text-center text-[11px] font-black tracking-[0.4em] uppercase pb-12 text-slate-500">
        &copy; ADHD Community Board — Wisdom in Chaos
      </div>
    </div>
  );
}