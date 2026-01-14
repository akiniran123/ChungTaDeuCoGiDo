import React from "react";
import type { Tables } from "@/types/supabase";
import { NOTE_PALETTES } from "@/components/notes/notes";

type Note = Tables<"notes">;

export const NoteCard = ({ note }: { note: Note }) => {
  const getNoteAppearance = (note: Note) => {
    const id = note.id;
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const heights = ["min-h-[160px]", "min-h-[200px]", "min-h-[180px]"];
    const rotates = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-0"];
    const spans = ["col-span-1", "col-span-1", "md:col-span-2", "col-span-1", "col-span-1"];

    const palette = NOTE_PALETTES.find(p => p.bg === note.color) || NOTE_PALETTES[0];

    return { 
      classes: `${heights[charCodeSum % 3]} ${rotates[charCodeSum % 5]} ${spans[charCodeSum % 5]}`, 
      textColor: palette.text 
    };
  };

  const { classes, textColor } = getNoteAppearance(note);

  return (
    <div
      style={{ backgroundColor: note.color || "#fff9c4", color: textColor }}
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
};