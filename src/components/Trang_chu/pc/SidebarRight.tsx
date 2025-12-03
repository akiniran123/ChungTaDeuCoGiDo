"use client";
import React from "react";
import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";

export default function SidebarRecentPosts({
  posts,
}: {
  posts: {
    id: number;
    subreddit: string;
    timeAgo: string;
    title: string;
    upvotes: number;
    comments: number;
  }[];
}) {
  return (
    <aside className="fixed top-[96px] right-[28px] z-30 w-[360px]">
      <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
            Recent Posts
          </h3>
        </div>

        <ul className="divide-y divide-gray-100">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex gap-4 px-5 py-4 text-sm hover:bg-gray-50 transition"
            >
              {/* Vote column */}
              <div className="flex flex-col items-center text-gray-500 min-w-[40px]">
                <ArrowUp size={16} className="hover:text-orange-500 cursor-pointer" />
                <span className="text-xs font-medium">{post.upvotes}</span>
              </div>

              {/* Info column */}
              <div className="flex-1">
                <Link
                  href={`/post/${post.id}`}
                  className="font-semibold text-gray-800 hover:text-pink-600 block leading-snug"
                >
                  {post.title.length > 80
                    ? post.title.slice(0, 77) + "..."
                    : post.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{post.subreddit}</span>
                  <span>•</span>
                  <span>{post.timeAgo}</span>
                  <MessageSquare size={12} className="ml-2" />
                  <span>{post.comments} bình luận</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}