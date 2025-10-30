import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// ⚙️ Cấu hình Firebase — copy từ Firebase Console
const firebaseConfig = { 
  apiKey : "AIzaSyBYI3nSnHVQHKSIY3NkDCjXSVdCZ_6Z50A" , 
  authDomain : "nexlot-2ceb3.firebaseapp.com" , 
  projectId : "nexlot-2ceb3" , 
  storageBucket : "nexlot-2ceb3.firebasestorage.app" , 
  messagingSenderId : "141108856035" , 
  appId : "1:141108856035:web:9fa7dae596d45beeb8b1d6" , 
  measurementId : "G-0719VE9XQF"
};

// ✅ Khởi tạo app
const app = initializeApp(firebaseConfig);

// ✅ Khởi tạo messaging (chỉ nếu trình duyệt hỗ trợ)
let messaging = null;
(async () => {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
    console.log("✅ Firebase Messaging supported");
  } else {
    console.warn("⚠️ Firebase Messaging is not supported on this browser");
  }
})();

// ✅ Hàm lấy FCM token (kèm VAPID key mới của bạn)
export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BIgunHcVieLZbSj-R5g9M3mrY5ATVFOEyN8sEUuVoK9Ot_hJS0gd6wD7jfWHmrU4XAsRBgXomy4noNo_b7l35iY",
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠️ No FCM token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting token:", error);
    return null;
  }
};

// ✅ Lắng nghe tin nhắn foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground notification:", payload);
      resolve(payload);
    });
  });
