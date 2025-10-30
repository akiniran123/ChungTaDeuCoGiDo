"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { requestForToken, onMessageListener } from "@/lib/firebase-config";

export default function FirebaseInit() {
  useEffect(() => {
    const saveToken = async () => {
      // 👇 Xin quyền thông báo
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("🚫 Notification permission not granted");
        return;
      }

      // 👇 Lấy token từ Firebase
      const token = await requestForToken();
      if (!token) {
        console.warn("⚠️ No FCM token");
        return;
      }

      // 👇 Lưu token vào Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("user_tokens")
          .upsert(
            { user_id: user.id, fcm_token: token },
            { onConflict: "user_id" }
          );

        if (error) console.error("❌ Error saving token:", error);
        else console.log("✅ Token FCM đã lưu vào Supabase");
      }
    };

    // 👇 Đăng ký service worker cho FCM
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
          saveToken();
        })
        .catch((error) =>
          console.error("❌ Service Worker registration failed:", error)
        );
    }

    // 👂 Lắng nghe thông báo khi app đang mở (foreground)
    onMessageListener().then((payload) => {
      console.log("📥 Thông báo foreground:", payload);
      const { title, body } = payload.notification || {};
      new Notification(title || "Thông báo mới", {
        body: body || "",
        icon: "/icon.png",
      });
    });
  }, []);

  return null;
}
