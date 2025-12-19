"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

interface CommentWithUsersRow {
  id: string;
  content: string | null;
  created_at: string | null;
  user_id: string;
  users?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export default function DealComments({
  productId,
  initialComments,
  onCountChange,
}: {
  productId: string;
  initialComments: Comment[];
  onCountChange: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const content = newComment.trim();
    if (!content) return;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const { data } = await supabase
      .from("comments")
      .insert({
        product_id: productId,
        user_id: auth.user.id,
        content,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        users ( username, avatar_url )
      `
      )
      .single<CommentWithUsersRow>();

    if (!data) return;

    const formatted: Comment = {
      id: data.id,
      user_id: data.user_id,
      content: data.content ?? "",
      created_at: data.created_at ?? "",
      user: {
        username: data.users?.username ?? "Người dùng",
        avatar_url: data.users?.avatar_url ?? "/default-avatar.png",
      },
    };

    setComments((prev) => [...prev, formatted]);
    onCountChange();
    setNewComment("");

    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="px-6 pb-6">
      <div className="flex gap-3 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Viết bình luận..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button onClick={handleSend}>
          <SendHorizontal />
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            {/* AVATAR */}
            <Link
              href={`/profile/${c.user_id}`}
              className="w-10 h-10 relative rounded-full overflow-hidden shrink-0"
            >
              <Image
                src={c.user.avatar_url ?? "/default-avatar.png"}
                alt="avatar"
                fill
                className="object-cover"
              />
            </Link>

            <div>
              {/* ✅ USERNAME – ÉP ĐEN + KHÔNG GẠCH CHÂN */}
              <Link
                href={`/profile/${c.user_id}`}
                className="
                  font-semibold
                  !text-gray-900
                  !visited:text-gray-900
                  no-underline
                  hover:no-underline
                "
              >
                {c.user.username}
              </Link>

              <p>{c.content}</p>

              <p className="text-xs text-gray-400">
                {c.created_at
                  ? new Date(c.created_at).toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
