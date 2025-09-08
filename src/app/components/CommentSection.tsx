"use client";

import { useState } from "react";

interface CommentSectionProps {
  productId: string;
}

export default function CommentSection({ productId }: CommentSectionProps) {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, newComment]);
    setNewComment("");
  };

  return (
    <div className="w-full md:w-1/3 border-l p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-3">💬 Bình luận</h2>

      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
        ) : (
          comments.map((c, i) => (
            <div
              key={i}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm"
            >
              {c}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Viết bình luận..."
          className="flex-1 border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
