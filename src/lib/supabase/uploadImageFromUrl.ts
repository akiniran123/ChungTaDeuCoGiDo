import { supabase } from "./client";

export async function uploadImageFromUrl(imageUrl: string) {
  try {
    // ✅ Bỏ các ký tự " dư thừa, chống lỗi %22
    const cleanUrl = imageUrl.replace(/"/g, "").trim();

    // Lấy dữ liệu ảnh từ URL thật
    const res = await fetch(cleanUrl);
    if (!res.ok) throw new Error("Không tải được ảnh từ URL");

    const blob = await res.blob();
    const ext = cleanUrl.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `url-${Date.now()}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, blob, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("❌ Upload lỗi:", err);
    return null;
  }
}
