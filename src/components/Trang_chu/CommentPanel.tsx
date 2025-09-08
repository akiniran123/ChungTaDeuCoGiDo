"use client";
import React from "react";

export default function CommentPanel({
  selectedDeal,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  setSelectedDeal,
}: {
  selectedDeal: number;
  comments: Record<
    number,
    {
      id: number;
      user: string;
      text: string;
    }[]
  >;
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
  setSelectedDeal: (value: number | null) => void;
}) {
  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white border-l shadow-xl flex flex-col z-50">
      {/* Tiêu đề panel */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg text-pink-600">
          Bình luận bài #{selectedDeal}
        </h3>
        <button
          onClick={() => setSelectedDeal(null)}
          className="text-gray-500 hover:text-red-500"
          aria-label="Đóng panel bình luận"
        >
          ✕
        </button>
      </div>

      {/* Danh sách bình luận */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(comments[selectedDeal] || []).map((cmt) => (
          <div
            key={cmt.id}
            className="p-3 bg-gray-50 rounded-lg shadow-sm text-sm"
          >
            <p className="font-semibold">{cmt.user}</p>
            <p>{cmt.text}</p>
          </div>
        ))}
      </div>

      {/* Form thêm bình luận */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          aria-label="Nhập bình luận"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}