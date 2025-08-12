import React from "react";
import Link from "next/link";

const exchangeRate = 30000;

const productNames = [
  "Điện thoại thông minh",
  "Máy tính xách tay",
  "Tai nghe không dây",
  "Máy ảnh kỹ thuật số",
  "Bàn phím cơ",
  "Chuột chơi game",
  "Tivi 4K",
  "Loa Bluetooth",
  "Đồng hồ thông minh",
  "Máy lọc không khí",
  "Nồi chiên không dầu",
  "Máy pha cà phê",
];

const sellers = [
  "Người bán Demo 1",
  "Người bán Demo 2",
  "Người bán Demo 3",
  "Người bán Demo 4",
  "Người bán Demo 5",
  "Người bán Demo 6",
  "Người bán Demo 7",
  "Người bán Demo 8",
  "Người bán Demo 9",
  "Người bán Demo 10",
  "Người bán Demo 11",
  "Người bán Demo 12",
];

const categories = [
  "Tất cả",
  "Công nghệ",
  "Nhà cửa",
  "Thời trang",
  "Thực phẩm",
  "Du lịch",
  "Mã giảm giá",
];

function formatVND(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₫";
}

const sampleDeals = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `🔥 Ưu đãi #${i + 1} — Giảm giá ${productNames[i]}`,
  price: formatVND((10 + i * 2) * exchangeRate),
  store: ["Amazon", "Currys", "Argos"][i % 3],
  image: `https://picsum.photos/seed/hukd${i}/500/300`,
  votes: 0,
  comments: 0,
  hotness: 0,
  category: categories[1 + (i % (categories.length - 1))],
  seller: sellers[i],
}));

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const product = sampleDeals.find((d) => d.id === id);

  if (!product) {
    return (
      <div className="p-4 max-w-3xl mx-auto mt-10 text-center text-red-600 font-semibold">
        Sản phẩm không tồn tại.
        <div className="mt-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-10">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className="w-full rounded-lg mb-4"
      />
      <div className="text-xl text-pink-600 font-semibold mb-2">{product.price}</div>
      <div className="mb-2">
        <strong>Người bán:</strong> {product.seller}
      </div>
      <div className="mb-2">
        <strong>Cửa hàng:</strong> {product.store}
      </div>
      <div className="mb-2">
        <strong>Danh mục:</strong> {product.category}
      </div>
      <div className="mb-4">
        <strong>Bình luận:</strong> {product.comments}
      </div>
      <Link
        href="/"
        className="inline-block mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
