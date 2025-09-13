import ProductCard from "@/components/ProductCard/ProductCard";

export default function GioHangPage() {
  const products = [
    {
      title: "Laptop Gaming",
      description: "Chiếc laptop mạnh mẽ dành cho game thủ.",
      image: "/images/laptop.jpg",
    },
    {
      title: "Chuột không dây",
      description: "Chuột không dây tiện dụng cho công việc và giải trí.",
      image: "/images/mouse.jpg",
    },
  ];

  return (
    <div className="p-6 pt-[64px] min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Giỏ hàng</h1>
      <p className="mt-2 text-gray-600">Các sản phẩm bạn đã thêm vào giỏ.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((p, index) => (
          <ProductCard key={index} {...p} />
        ))}
      </div>
    </div>
  );
}

