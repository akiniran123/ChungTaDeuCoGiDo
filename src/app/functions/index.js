import * as functions from "firebase-functions";
import fetch from "node-fetch";

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_SERVICE_ROLE_KEY"; // 🔥 Service Role Key (chỉ dùng trong server)
const SUPABASE_TABLE = "notifications";

// Khi có dữ liệu mới trong Firestore → đẩy sang Supabase
export const onNewPost = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const payload = {
      user_id: data.userId,
      title: data.title || "Bài viết mới!",
      body: data.summary || "Có nội dung mới vừa được đăng.",
      data: {
        image_url: data.imageUrl || null,
        link: `/bai-viet/${context.params.postId}`,
      },
      read: false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("❌ Lỗi gửi dữ liệu lên Supabase:", await res.text());
    } else {
      console.log("✅ Đã gửi dữ liệu mới lên Supabase!");
    }
  });
