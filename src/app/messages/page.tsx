import ProductCard from "@/components/ProductCard/ProductCard";

export default function MessagesPage() {
  const products = [
    {
      title: "Thông báo đơn hàng",
      description: "Đơn hàng #1234 của bạn đang được vận chuyển.",
      image: "/images/box.jpg",
    },
    {
      title: "Khuyến mãi hot",
      description: "Giảm giá 50% cho tất cả sản phẩm gaming.",
      image: "/images/sale.jpg",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tin nhắn</h1>
      <p className="mt-2 text-gray-600">Các tin nhắn và thông báo gần đây.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((p, index) => (
          <ProductCard key={index} {...p} />
        ))}
      </div>
    </div>
  );
}
