// src/lib/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ⚙️ Config Firebase — lấy trong Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Hàm xin quyền và lấy token FCM
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY", // 🔑 Lấy từ Firebase Cloud Messaging > Web Push certificates
    });
    if (currentToken) {
      console.log("✅ FCM token:", currentToken);
      return currentToken;
    } else {
      console.log("⚠️ Không có token (chưa được cấp quyền).");
      return null;
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy FCM token:", err);
    return null;
  }
};

// ✅ Lắng nghe thông báo khi app đang mở
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Thông báo nhận được:", payload);
      resolve(payload);
    });
  });
