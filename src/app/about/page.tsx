"use client";

import Image from "next/image";
import { Users, Globe, Lightbulb, ShieldCheck, Handshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      {/* Ảnh và mô tả ngắn */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
        <Image
          src="/assets/products/dep.jpg"
          alt="Giới thiệu"
          width={360}
          height={260}
          className="rounded-xl object-cover shadow-md"
        />
        <div className="flex-1 text-lg leading-relaxed space-y-4">
          <p>
            Chúng tôi là một tập thể trẻ trung, năng động, với tầm nhìn xây dựng một nền tảng số hiện đại, dễ tiếp cận và có khả năng ứng dụng cao. Sứ mệnh của chúng tôi là kết nối con người với công nghệ theo cách gần gũi và hữu ích nhất.
          </p>
          <p>
            Trang web không chỉ đơn thuần là nơi giới thiệu sản phẩm, mà còn là một hệ sinh thái mở – nơi người dùng có thể khám phá, chia sẻ và cùng nhau phát triển.
          </p>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="text-lg leading-relaxed space-y-10">
        {/* Tầm nhìn và sứ mệnh */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Globe className="w-6 h-6 text-green-500" />
            Tầm nhìn và sứ mệnh
          </h2>
          <p>
            Chúng tôi luôn lấy người dùng làm trung tâm trong mọi hoạt động phát triển. Mỗi dòng mã, mỗi thiết kế đều được cân nhắc kỹ để phục vụ tốt nhất nhu cầu của cộng đồng. Tính đơn giản, tốc độ và hiệu quả là các giá trị cốt lõi được chúng tôi theo đuổi.
          </p>
        </div>

        {/* Đội ngũ đáng tin cậy */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-purple-500" />
            Đội ngũ đáng tin cậy
          </h2>
          <p>
            Đội ngũ kỹ thuật viên và thiết kế của chúng tôi là những người tận tâm, được đào tạo chuyên sâu và không ngừng học hỏi. Sự chuyên nghiệp và trách nhiệm là những yếu tố làm nên chất lượng dịch vụ bền vững.
          </p>
        </div>

        {/* Đổi mới */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Không ngừng đổi mới
          </h2>
          <p>
            Trong bối cảnh thị trường luôn biến động, chúng tôi coi việc đổi mới là yếu tố sống còn. Mỗi ngày là một cơ hội để cải tiến – từ giao diện đến hiệu năng – nhằm mang đến trải nghiệm ngày càng tốt hơn cho người dùng.
          </p>
        </div>

        {/* Hợp tác cộng đồng */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Handshake className="w-6 h-6 text-pink-500" />
            Hợp tác & phát triển cộng đồng
          </h2>
          <p>
            Chúng tôi xây dựng mối quan hệ bền vững với các đối tác uy tín trong và ngoài nước. Cùng với đó là việc kết nối cộng đồng để chia sẻ tri thức, mở rộng tầm nhìn và tạo ra giá trị chung cho xã hội.
          </p>
        </div>

        {/* Tầm nhìn & Chiến lược của cổ đông */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-500" />
            Tầm nhìn & Chiến lược của cổ đông
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold">🧑‍💼 Nguyễn Tuấn Nghĩa</h3>
              <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                NexLoot cam kết không ngừng đổi mới, đặt khách hàng và cộng đồng lên hàng đầu.
                Tầm nhìn của chúng tôi là trở thành công ty công nghệ hàng đầu Đông Nam Á trong 10 năm tới,
                đồng hành cùng sự phát triển bền vững và ứng dụng công nghệ vào cuộc sống.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">
                — Chủ sở hữu & Đồng sáng lập, công ty NexLoot
              </p>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold">🧑‍💼 Trần Đức Anh</h3>
              <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                Chiến lược dài hạn của chúng tôi là xây dựng hệ sinh thái số hiện đại,
                lấy công nghệ làm nền tảng, đội ngũ nhân sự là cốt lõi, hướng đến hội nhập quốc tế,
                minh bạch tài chính và nâng cao trải nghiệm người dùng toàn diện.
              </p>
              <p className="text-xs mt-4 text-right text-gray-500">
                — Chủ sở hữu & Đồng sáng lập, công ty NexLoot
              </p>
            </div>
          </div>
        </div>

        {/* Cảm ơn */}
        <div>
          <p>
            Xin chân thành cảm ơn bạn đã quan tâm và đồng hành cùng chúng tôi. Niềm tin và sự ủng hộ của bạn là động lực quý giá để chúng tôi tiếp tục hoàn thiện nền tảng ngày một tốt hơn.
          </p>
        </div>
      </div>
    </div>
  );
}
