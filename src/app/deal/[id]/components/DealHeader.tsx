import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function DealHeader({
  product,
  author,
}: {
  product: Product;
  author: User | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* USER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={author?.avatar_url || "/default-avatar.png"}
          alt={author?.username || "User Avatar"}
          className="w-12 h-12 rounded-full border object-cover"
        />

        <div>
          <p className="font-semibold text-lg">
            {author?.username || "Người dùng"}
          </p>
          <p className="text-gray-500 text-sm">
            Đăng vào:{" "}
            {product.created_at
              ? new Date(product.created_at).toLocaleString()
              : "Không rõ thời gian"}
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

      {/* IMAGE — GIỮ 2/3 KHI ĐẶT TRONG GRID */}
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full max-h-[460px] object-cover rounded-xl shadow mb-6"
        />
      )}
    </div>
  );
}
