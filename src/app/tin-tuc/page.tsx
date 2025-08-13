import ProductCard from "@/components/ProductCard/ProductCard";

export default function TinTucPage() {
  const products = [
    {
      title: "Ra mắt sản phẩm mới",
      description: "Chúng tôi vừa ra mắt dòng laptop mới hiệu suất cao.",
      image: "/images/new-laptop.jpg",
    },
    {
      title: "Sự kiện công nghệ 2025",
      description: "Hội chợ công nghệ lớn nhất Việt Nam diễn ra vào tháng tới.",
      image: "/images/event.jpg",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tin tức</h1>
      <p className="mt-2 text-gray-600">Thông tin và cập nhật mới nhất.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((p, index) => (
          <ProductCard key={index} {...p} />
        ))}
      </div>
    </div>
  );
}
