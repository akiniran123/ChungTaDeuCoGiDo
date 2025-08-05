"use client";

import { Rocket, Users, Brain, BarChart3, Truck } from "lucide-react";

export default function VisionHighlights() {
  const highlights = [
    {
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      title: "Nền tảng tối ưu – Tốc độ vượt trội",
      description:
        "Phiên bản mới tăng tốc độ tải trang đến 40%, thiết kế tối giản hiện đại, mang lại trải nghiệm mượt mà cho cả người mua và người bán.",
    },
    {
      icon: <Users className="w-6 h-6 text-pink-500" />,
      title: "1 triệu người dùng sau 6 tháng",
      description:
        "Một cột mốc đáng tự hào, khẳng định niềm tin của cộng đồng vào NexLoot. Xin cảm ơn vì đã đồng hành!",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "Tìm kiếm thông minh bằng AI",
      description:
        "AI phân tích hành vi & đề xuất sản phẩm chính xác hơn. Giúp tiết kiệm thời gian và tăng tỷ lệ chuyển đổi.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-yellow-500" />,
      title: "Báo cáo thị trường định kỳ",
      description:
        "Cập nhật xu hướng tiêu dùng, biến động giá & sản phẩm bán chạy, hỗ trợ quyết định kinh doanh hiệu quả.",
    },
    {
      icon: <Truck className="w-6 h-6 text-orange-500" />,
      title: "Tăng tốc giao hàng toàn quốc",
      description:
        "Hợp tác chiến lược cùng đối tác vận chuyển uy tín, giảm thời gian giao hàng và hỗ trợ hoàn tiền khi chậm trễ.",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-16 bg-white dark:bg-black text-black dark:text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">Điểm nhấn nổi bật</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <div>{item.icon}</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
