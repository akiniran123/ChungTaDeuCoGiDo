import { Product } from "@/types";

export type NormalizedProduct = Product & {
  brand?: string | null;
  type?: string | null;
  cpu?: string | null;
  gpu?: string | null;
  ram?: number | string | null;
};

/**
 * ✅ Hàm chuẩn hóa dữ liệu sản phẩm từ Supabase
 * - Tự động parse specs nếu là JSON string
 * - Đảm bảo images là mảng
 * - Thêm giá trị mặc định cho các field còn thiếu
 * - Chuẩn hóa các field cho UI lọc/sắp xếp
 */
export function normalizeProducts(products: any[]): NormalizedProduct[] {
  return products.map((p) => {
    // ✅ Chuẩn hóa specs
    let specs: Record<string, any> = {};
    if (typeof p.specs === "string") {
      try {
        specs = JSON.parse(p.specs);
      } catch {
        specs = {};
      }
    } else if (typeof p.specs === "object" && p.specs !== null) {
      specs = p.specs;
    }

    // ✅ Chuẩn hóa images
    const images =
      typeof p.images === "string"
        ? (() => {
            try {
              return JSON.parse(p.images);
            } catch {
              return [p.images];
            }
          })()
        : Array.isArray(p.images)
        ? p.images
        : [];

    // ✅ Lấy thông tin từ specs
    const brand = specs.brand || specs.hang || specs["hãng"] || null;
    const type = specs.type || specs.loai || specs["loại"] || null;
    const cpu = specs.cpu || specs["CPU"] || null;
    const gpu = specs.gpu || specs["GPU"] || null;
    const ram = specs.ram || specs["RAM"] || null;

    // ✅ Trả về object đầy đủ các field mà Product yêu cầu
    return {
      id: p.id,
      title: p.title || "",
      category: p.category || null,
      is_private: p.is_private ?? null,
      condition: p.condition || null,
      description: p.description || null,
      specs,
      images,
      video_url: p.video_url || null,
      price: p.price ?? null,
      enable_offers: p.enable_offers ?? null,
      min_offer: p.min_offer ?? null,
      quantity: p.quantity ?? null,
      sku: p.sku || null,
      return_policy: p.return_policy || null,
      user_id: p.user_id,
      image_url: p.image_url || null,
      created_at: p.created_at || null,
      community_id: p.community_id || null,
      upvotes: p.upvotes ?? 0,
      views: p.views ?? 0,

      // 🧩 Thêm cho UI lọc
      brand,
      type,
      cpu,
      gpu,
      ram,
    };
  });
}
