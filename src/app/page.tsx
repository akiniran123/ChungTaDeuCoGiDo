"use client";

import { CheckSquare, Activity, Lightbulb } from "lucide-react";

export default function CustomLayoutPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      
      {/* 1. Header Banner - Đã fix lỗi dấu ngoặc kép */}
      <header className="bg-[#1d72f2] text-white p-6 md:p-10 rounded-sm shadow-md text-center relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg md:text-2xl font-serif italic leading-relaxed">
            &quot;Only you know what works for your brain; honor your intuition, even when professionals disagree.&quot;
          </h1>
        </div>
        <div className="absolute bottom-2 left-4 text-[10px] opacity-60 uppercase tracking-tighter">
          ADHD-UPLIFT-PROJECT
        </div>
      </header>

      {/* 2. Middle Section - To do & Track list */}
      <div className="border-2 border-red-800/20 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Cột trái: To do (Sticky Note) */}
          <div className="md:col-span-4 bg-[#fff9c4] p-6 shadow-lg border border-yellow-200 min-h-[300px] transform -rotate-1">
            <div className="flex items-center gap-2 mb-4 border-b border-yellow-400/50 pb-2">
              <CheckSquare className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-red-700 text-xl">to do</h2>
            </div>
            <ul className="space-y-4 text-gray-800 font-medium">
              <li className="flex flex-col">
                <span className="text-red-600 text-lg">- Thư ký</span>
                <span className="text-xs text-gray-500 font-normal">Đặng Phương Linh Bùi</span>
              </li>
              <li className="text-red-600 text-lg">- DA</li>
              <li className="text-red-600 text-lg">- Link</li>
              {/* Các dòng kẻ trống mô phỏng nét vẽ */}
              <li className="border-b border-yellow-400/30 h-6"></li>
              <li className="border-b border-yellow-400/30 h-6"></li>
            </ul>
          </div>

          {/* Cột phải: Track list (Vùng xanh lá) */}
          <div className="md:col-span-8 bg-[#dcedc8] p-6 shadow-md border border-green-200 min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-700" />
              <h2 className="font-bold text-green-800 text-xl italic uppercase">track list</h2>
            </div>
            <div className="flex-1 bg-white/40 rounded-lg border-2 border-dashed border-green-300 flex items-center justify-center">
              <span className="text-green-900/20 font-black text-5xl transform -rotate-6 select-none">
                TRACK CONTENT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section - Tips Section */}
      <div className="space-y-4 pt-4 border-l-4 border-red-700/30 pl-6">
        {/* Label Tips màu xanh */}
        <div className="bg-[#1d72f2] text-white px-10 py-2 w-fit rounded-full flex items-center gap-2 shadow-lg transform -translate-x-10">
          <Lightbulb className="w-6 h-6 fill-yellow-300 text-yellow-300" />
          <span className="font-black text-xl uppercase tracking-widest italic">Tips</span>
        </div>
        
        {/* List nội dung 1, 2, 3 */}
        <div className="space-y-4">
          {[
            { id: 1, color: "bg-blue-50 border-blue-400" },
            { id: 2, color: "bg-green-50 border-green-400" },
            { id: 3, color: "bg-orange-50 border-orange-400" }
          ].map((item) => (
            <div 
              key={item.id} 
              className={`p-8 rounded-lg shadow-sm border-l-[12px] flex items-center gap-6 transition-all hover:scale-[1.01] ${item.color}`}
            >
              <span className="text-6xl font-black text-gray-900/10 italic">{item.id}</span>
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-gray-900/10 rounded-full w-full"></div>
                <div className="h-3 bg-gray-900/10 rounded-full w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}