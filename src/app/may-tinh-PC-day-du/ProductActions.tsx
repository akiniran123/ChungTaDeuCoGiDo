"use client"

import React, { useState } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react"

type Props = {
  productId: number
}

export default function ProductActions({ productId }: Props) {
  const [votes, setVotes] = useState(0)

  const handleUpvote = () => setVotes((prev) => prev + 1)
  const handleDownvote = () => setVotes((prev) => prev - 1)

  const handleComment = () => {
    alert(`Bình luận cho sản phẩm ID: ${productId}`)
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/may-tinh-PC-day-du/${productId}`
      )
      alert("Đã copy link sản phẩm!")
    }
  }

  return (
    <div className="flex flex-row items-center gap-4 mt-3 text-gray-600 text-sm">
      {/* Vote (Up + Down + số điểm) */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border shadow">
        <button
          onClick={handleUpvote}
          className="hover:text-blue-500"
        >
          <ThumbsUp size={18} />
        </button>
        <span className="font-medium">{votes}</span>
        <button
          onClick={handleDownvote}
          className="hover:text-blue-500"
        >
          <ThumbsDown size={18} />
        </button>
      </div>

      {/* Comment */}
      <button
        onClick={handleComment}
        className="p-2 rounded-full bg-white border shadow hover:text-blue-500"
      >
        <MessageCircle size={18} />
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="p-2 rounded-full bg-white border shadow hover:text-blue-500"
      >
        <Share2 size={18} />
      </button>
    </div>
  )
}
