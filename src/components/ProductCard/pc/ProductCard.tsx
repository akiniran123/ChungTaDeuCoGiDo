import Image from "next/image";

export default function ProductCard({
  product,
}: {
  product: {
    id: string;
    title: string | null;
    price: number | null;
    images: string[] | null;
    description?: string | null;
    category?: string | null;
  };
}) {
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/no-image.png";

  return (
    <div className="border rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-3 bg-white">
      <div className="relative w-full h-48 mb-3">
        <Image
          src={imageSrc}
          alt={product.title ?? "Sản phẩm"}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <h2 className="font-semibold text-lg line-clamp-1">
        {product.title ?? "Không có tên"}
      </h2>
      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
        {product.description ?? ""}
      </p>
      <p className="font-bold text-blue-600">
        {product.price ? `${product.price.toLocaleString()} ₫` : "Liên hệ"}
      </p>
    </div>
  );
}
