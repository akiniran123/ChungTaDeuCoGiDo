"use client";

import { Briefcase, Users, Sparkles } from "lucide-react";

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="space-y-12 text-lg leading-relaxed">

        {/* Giới thiệu chung */}
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <Users className="w-7 h-7 text-green-500" />
            Gia nhập đội ngũ sáng tạo cùng NexLoot
          </h2>
          <p>
            NexLoot luôn chào đón những tài năng trẻ nhiệt huyết, đam mê công nghệ và sẵn sàng chinh phục thử thách. Cùng chúng tôi phát triển những sản phẩm có giá trị và tạo nên dấu ấn riêng trong thị trường công nghệ Việt Nam.
          </p>
        </div>

        {/* Vị trí tuyển */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Vị trí hiện tại
          </h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>Frontend Developer (React/Next.js):</strong> Phát triển giao diện web tối ưu hiệu suất.
              <br />
              💼 Lương: 12–18 triệu VNĐ/tháng
            </li>
            <li>
              <strong>UI/UX Designer:</strong> Thiết kế trải nghiệm người dùng trực quan, hiện đại.
              <br />
              💼 Lương: 10–15 triệu VNĐ/tháng
            </li>
            <li>
              <strong>Content Marketing:</strong> Xây dựng nội dung hấp dẫn cho các chiến dịch truyền thông.
              <br />
              💼 Lương: 8–12 triệu VNĐ/tháng
            </li>
          </ul>
        </div>

        {/* Cách ứng tuyển */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Cách ứng tuyển</h2>
          <p>
            Gửi CV và portfolio của bạn về email: <span className="text-blue-600">tuyendung@nexloot.vn</span>
          </p>
          <p className="mt-2">
            Hoặc điền thông tin tại:{" "}
            <a href="#" className="text-blue-500 underline">nexloot.vn/tuyendung</a>
          </p>
        </div>

        {/* Kết thúc */}
        <div className="pt-4">
          <p>
            Cơ hội đang chờ bạn! Hãy trở thành một phần trong hành trình phát triển và bứt phá cùng chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
