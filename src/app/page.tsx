"use client";

import React, { useEffect, useState, useRef } from "react";
import { StickyNote, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { NOTE_PALETTES } from "@/components/notes/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteInput } from "@/components/notes/NoteInput";
import { TipsBoard } from "@/components/Tips/TipsBoard"; // Import component vừa tạo
import type { Tables } from "@/types/supabase";

type Note = Tables<"notes">;

export default function SharedNoteBoardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loadingNote, setLoadingNote] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
      if (data) setNotes(data as Note[]);
    };

    fetchNotes();
    const channel = supabase.channel("notes-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notes" }, (payload) => {
        setNotes((prev) => [payload.new as Note, ...prev]);
      })
      .subscribe();

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY <= lastScrollY.current || currentY <= 100);
      lastScrollY.current = currentY;
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
    setLoadingNote(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const palette = NOTE_PALETTES[Math.floor(Math.random() * NOTE_PALETTES.length)];
      await supabase.from("notes").insert([{
        content: newNote,
        username: userData.user?.user_metadata?.full_name || "Người dùng ẩn danh",
        user_id: userData.user?.id || null,
        color: palette.bg,
      }]);
      setNewNote("");
    } finally { setLoadingNote(false); }
  };

  return (
    <div className="w-full p-2 md:p-6 space-y-20 bg-[#f8fafc] min-h-screen">
      
      {/* PHẦN 1: THE STICKY WALL (Notes) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 pt-10">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-2xl mb-2">
            <StickyNote className="text-yellow-600 w-6 h-6" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase">The Sticky Wall</h2>
          <p className="text-slate-500 font-medium italic">Gửi gắm những ý tưởng bất chợt của bạn</p>
        </div>

        <NoteInput 
          newNote={newNote} setNewNote={setNewNote} 
          onSubmit={handleAddNote} loading={loadingNote} isVisible={isVisible} 
        />

        <div className="min-h-[400px] border-[12px] border-white p-6 md:p-10 rounded-[3.5rem] bg-gradient-to-tr from-slate-50 via-white to-blue-50/30 shadow-2xl relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {notes.map((note) => <NoteCard key={note.id} note={note} />)}
          </div>
        </div>
      </section>

      {/* DẢI PHÂN CÁCH TRANG TRÍ */}
      <div className="flex items-center gap-6 max-w-4xl mx-auto py-10">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-300"></div>
        <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-300"></div>
      </div>

      {/* PHẦN 2: COMMUNITY TIPS (Sử dụng component tách biệt) */}
      <TipsBoard />

    </div>
  );
}