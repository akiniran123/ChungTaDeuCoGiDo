import { supabase } from "@/lib/supabase/client";

export async function uploadImageFromUrl(url: string, userId: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // 📂 Lưu ảnh trong thư mục riêng của user
    const fileName = `${userId}/from-link-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, blob);

    if (error) {
      console.error("❌ Upload from URL failed:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("❌ Error fetching image from URL:", err);
    return null;
  }
}
