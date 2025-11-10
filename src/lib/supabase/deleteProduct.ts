import { supabase } from "@/lib/supabase/client";

/**
 * Xóa bài đăng + ảnh trong storage/images
 */
export async function deleteProduct(productId: string) {
  try {
    // 1️⃣ Lấy thông tin bài đăng
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("images")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      console.error("❌ Không tìm thấy bài đăng:", fetchError);
      return false;
    }

    // 2️⃣ Xóa ảnh trong storage (nếu có)
    if (product.images && product.images.length > 0) {
      const imageUrls: string[] = Array.isArray(product.images)
        ? product.images
        : [product.images];

      // ✅ Lấy chính xác path trong bucket “images”
      const filePaths = imageUrls
        .map((url) => {
          try {
            // Ví dụ: "https://xxx.supabase.co/storage/v1/object/public/images/user_abc/product-123.jpg"
            // → tách lấy phần sau “/images/”
            const parts = url.split("/images/");
            if (parts.length < 2) return null;
            return parts[1]; // "user_abc/product-123.jpg"
          } catch {
            return null;
          }
        })
        .filter((path): path is string => !!path);

      console.log("🧩 FilePaths cần xóa:", filePaths);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("images")
          .remove(filePaths);

        if (storageError) {
          console.warn("⚠️ Không xóa được ảnh:", storageError.message);
        } else {
          console.log("🧹 Đã xóa ảnh trong Storage:", filePaths);
        }
      }
    }

    // 3️⃣ Xóa bài đăng trong bảng products
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) throw deleteError;

    console.log("✅ Đã xóa bài đăng & ảnh thành công!");
    return true;
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài:", err);
    return false;
  }
}
