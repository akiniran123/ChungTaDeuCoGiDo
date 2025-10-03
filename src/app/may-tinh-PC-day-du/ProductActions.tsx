"use client"

import React, { useState } from "react"
import { ArrowUp, ArrowDown, MessageSquare, Share2, X } from "lucide-react"

type Props = {
  productId: number
}

export default function ProductActions({ productId }: Props) {
  const [votes, setVotes] = useState(0)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState("")
  const [showCommentSidebar, setShowCommentSidebar] = useState(false)
  const [shareCount, setShareCount] = useState(0)

  const handleUpvote = () => setVotes((prev) => prev + 1)
  const handleDownvote = () => setVotes((prev) => prev - 1)

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments((prev) => [...prev, newComment.trim()])
      setNewComment("")
    }
  }

  const handleToggleCommentSidebar = () =>
    setShowCommentSidebar((prev) => !prev)

  const handleShare = async () => {
    const url = `${window.location.origin}/may-tinh-PC-day-du/${productId}`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Xem sản phẩm", url })
      } catch (err) {
        console.error("Share failed:", err)
        return
      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Đã copy link sản phẩm!")
    }
    setShareCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="flex flex-row items-center gap-2 mt-3 text-gray-700 text-sm">
        {/* Vote */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm">
          <button onClick={handleUpvote} className="hover:text-pink-600 p-1 cursor-pointer">
            <ArrowUp size={16} />
          </button>
          <span className="font-semibold text-xs text-center min-w-[20px]">{votes || "0"}</span>
          <button onClick={handleDownvote} className="hover:text-pink-600 p-1 cursor-pointer">
            <ArrowDown size={16} />
          </button>
        </div>

        {/* Comment */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm cursor-pointer hover:text-pink-600" onClick={handleToggleCommentSidebar}>
          <MessageSquare size={16} />
          <span className="font-semibold text-xs text-center min-w-[20px]">{comments.length || "0"}</span>
        </div>

        {/* Share */}
        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-sm cursor-pointer hover:text-pink-600" onClick={handleShare}>
          <Share2 size={16} />
          <span className="font-semibold text-xs text-center min-w-[20px]">{shareCount || "0"}</span>
        </div>
      </div>

      {/* Sidebar Bình luận */}
      {showCommentSidebar && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg">Bình luận</h2>
            <button
              onClick={handleToggleCommentSidebar}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nội dung bình luận */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
            )}
            {comments.map((c, i) => (
              <div
                key={i}
                className="text-gray-700 text-sm p-2 bg-gray-100 rounded"
              >
                {c}
              </div>
            ))}
          </div>

          {/* Input thêm bình luận */}
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment()
                }
              }}
              placeholder="Viết bình luận..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
