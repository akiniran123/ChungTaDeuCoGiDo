"use client";

import React from "react";
import { Lightbulb } from "lucide-react"; // Đã thêm import bị thiếu

// 1. Định nghĩa kiểu dữ liệu cho Props để thay thế 'any'
interface TipFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  loading: boolean;
}

export const TipForm = ({ onSubmit, loading }: TipFormProps) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className="bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-white/10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          name="title"
          type="text"
          placeholder="Tiêu đề mẹo..." 
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
          required
        />
        <select 
          name="category"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
        >
          <option value="Productivity" className="bg-slate-800">Productivity</option>
          <option value="Life Hack" className="bg-slate-800">Life Hack</option>
          <option value="Learning" className="bg-slate-800">Learning</option>
        </select>
      </div>
      
      <textarea 
        name="content"
        placeholder="Mô tả chi tiết mẹo của bạn..." 
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none transition-all placeholder:text-slate-500"
        required
      />

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20"
      >
        <Lightbulb className={`w-5 h-4 transition-transform ${loading ? "animate-pulse" : "group-hover:rotate-12"}`} />
        {loading ? "ĐANG LƯU..." : "CHIA SẺ MẸO"}
      </button>
    </form>
  );
};