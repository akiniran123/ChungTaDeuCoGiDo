import React from "react";
import { Send } from "lucide-react";

interface NoteInputProps {
  newNote: string;
  setNewNote: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isVisible: boolean;
}

export const NoteInput = ({ newNote, setNewNote, onSubmit, loading, isVisible }: NoteInputProps) => {
  return (
    <section 
      className={`max-w-4xl mx-auto w-full backdrop-blur-md bg-white/70 p-6 rounded-3xl border border-white/50 shadow-2xl sticky top-4 z-30 ring-8 ring-blue-500/5 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
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
  );
};