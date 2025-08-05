"use client";

import Image from "next/image";
import {
  Globe,
  ShieldCheck,
  Lightbulb,
  Handshake,
  Users,
  Rocket,
  Target,
  TrendingUp,
  Gem,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-4">
          Hành trình kết nối con người với công nghệ
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Chúng tôi không chỉ xây dựng một nền tảng – mà là một hệ sinh thái số bền vững, hiện đại và nhân văn.
        </p>
      </div>

      {/* Hình ảnh giới thiệu */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-20">
        <Image
          src="/assets/products/dep.jpg"
          alt="Giới thiệu"
          width={500}
          height={300}
          className="rounded-xl object-cover shadow-md"
        />
        <div className="flex-1 text-lg leading-relaxed space-y-4">
          <p>
            Chúng tôi là một tập thể trẻ trung, nhiệt huyết, hướng đến xây dựng nền tảng số tiện lợi, dễ tiếp cận và mang lại giá trị thiết thực cho người dùng.
          </p>
          <p>
            Trang web không chỉ là nơi mua bán, mà còn là không gian kết nối và đồng hành – nơi mọi người cùng khám phá, chia sẻ và phát triển.
          </p>
        </div>
      </div>

      {/* Mục tiêu - Tầm nhìn - Giá trị */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <Section
          icon={<Globe className="w-8 h-8 text-green-500" />}
          title="Tầm nhìn & sứ mệnh"
          content="Lấy người dùng làm trung tâm, chúng tôi theo đuổi sự đơn giản, tốc độ và hiệu quả trong từng sản phẩm – tạo nên trải nghiệm mượt mà và đáng tin cậy."
        />
        <Section
          icon={<ShieldCheck className="w-8 h-8 text-purple-500" />}
          title="Đội ngũ tận tâm"
          content="Đội ngũ kỹ thuật và thiết kế luôn học hỏi, đổi mới và phục vụ với tinh thần trách nhiệm cao."
        />
        <Section
          icon={<Lightbulb className="w-8 h-8 text-yellow-500" />}
          title="Luôn đổi mới"
          content="Chúng tôi liên tục cải tiến sản phẩm – từ giao diện, hiệu năng đến trải nghiệm – để bắt kịp xu hướng và phục vụ tốt hơn."
        />
        <Section
          icon={<Handshake className="w-8 h-8 text-pink-500" />}
          title="Kết nối cộng đồng"
          content="Hợp tác với đối tác uy tín, tạo không gian mở để cộng đồng cùng học hỏi, đóng góp và phát triển lâu dài."
        />
      </div>

      {/* Giá trị cốt lõi */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Giá trị cốt lõi</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CoreValue icon={<Rocket />} title="Tốc độ" />
          <CoreValue icon={<Target />} title="Chính xác" />
          <CoreValue icon={<TrendingUp />} title="Hiệu quả" />
          <CoreValue icon={<Gem />} title="Tin cậy" />
        </div>
      </div>

      {/* Tầm nhìn từ cổ đông */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Tầm nhìn & chiến lược</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <ShareholderCard
            name="🧑‍💼 Nguyễn Tuấn Nghĩa"
            content="NexLoot cam kết lấy người dùng làm trọng tâm, hướng đến trở thành nền tảng công nghệ hàng đầu Đông Nam Á trong 10 năm tới – gắn kết công nghệ với cuộc sống."
          />
          <ShareholderCard
            name="🧑‍💼 Trần Đức Anh"
            content="Chúng tôi xây dựng hệ sinh thái số hiện đại, minh bạch, lấy công nghệ làm nền tảng và trải nghiệm người dùng làm định hướng phát triển lâu dài."
          />
        </div>
      </div>

      {/* Cảm ơn */}
      <div className="text-center text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
        Cảm ơn bạn đã đồng hành cùng chúng tôi. Sự tin tưởng của bạn là động lực để NexLoot không ngừng hoàn thiện và vươn xa.
      </div>
    </div>
  );
}

// Section component
function Section({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </div>
    </div>
  );
}

// Shareholder Card
function ShareholderCard({
  name,
  content,
}: {
  name: string;
  content: string;
}) {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
      <p className="text-xs mt-4 text-right text-gray-500">
        — Chủ sở hữu & Đồng sáng lập, NexLoot
      </p>
    </div>
  );
}

// Core Value Item
function CoreValue({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <div className="w-12 h-12 flex items-center justify-center mb-2 text-blue-500">
        {icon}
      </div>
      <h4 className="font-semibold">{title}</h4>
    </div>
  );
}
