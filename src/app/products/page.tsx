import Image from "next/image";
import Link from "next/link";
import { getServerClient } from "@/lib/supabase/serverClient";
import type { Product } from "@/types/supabase";

// 🧠 SEO metadata
export const metadata = {
  title: "Danh sách sản phẩm",
  description: "Xem các sản phẩm mới nhất được đăng tải trên hệ thống.",
};

// 🔁 Tái tạo lại trang mỗi 30s (ISR)
export const revalidate = 30;

// 🧩 Hàm parse JSON an toàn
function safeParse<T>(value: any, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export default async function ProductsPage() {
  const supabase = await getServerClient();

  // 📦 Lấy dữ liệu từ bảng "products"
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Lỗi lấy dữ liệu sản phẩm:", error.message);
    return (
      <div className="p-10 text-center text-red-500">
        Lỗi khi tải sản phẩm. Vui lòng thử lại sau.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-10 text-center text-gray-400">
        Chưa có sản phẩm nào được đăng.
      </div>
    );
  }

  // 🔧 Chuẩn hóa dữ liệu trả về
  const products: Product[] = data.map((p) => {
    const specs =
      typeof p.specs === "string"
        ? safeParse<Record<string, any>>(p.specs, {})
        : (p.specs as Record<string, any> | null);

    // ✅ Xử lý ảnh
    let images: string[] = [];

    if (p.images) {
      try {
        const temp = JSON.parse(p.images);
        if (Array.isArray(temp)) {
          images = temp.flat(Infinity).map(String);
        } else if (typeof temp === "string") {
          images = [temp];
        } else {
          images = [String(p.images)];
        }
      } catch {
        images = [p.images];
      }
    } else if (p.image_url) {
      images = [p.image_url];
    }

    return { ...p, specs, images };
  });

  // 🧱 Giao diện hiển thị
  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const imageUrl = decodeURIComponent(
          p.images?.[0] || p.image_url || "/no-image.png"
        );

        return (
          <Link
            href={`/products/${p.id}`}
            key={p.id}
            className="border rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden bg-white dark:bg-gray-900"
          >
            {/* Ảnh sản phẩm */}
            <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-800">
              <Image
                src={imageUrl}
                alt={p.title || "Sản phẩm"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
              />
            </div>

            {/* Thông tin */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                {p.title || "Không có tên"}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                {p.description || "Không có mô tả"}
              </p>

              {p.price ? (
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {p.price.toLocaleString()} ₫
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  Liên hệ
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
