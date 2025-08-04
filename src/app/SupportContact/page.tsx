"use client";

import { Phone, Mail, HelpCircle } from "lucide-react";

export default function SupportContactPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="space-y-8 text-lg leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Phone className="w-6 h-6 text-green-500" />
            Hotline hỗ trợ
          </h2>
          <p>
            Gọi ngay cho chúng tôi qua số <strong>1900 999 888</strong> từ 8h đến 21h mỗi ngày để được giải đáp mọi thắc mắc nhanh chóng và tận tình.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Mail className="w-6 h-6 text-red-500" />
            Gửi email hỗ trợ
          </h2>
          <p>
            Bạn có thể gửi mọi yêu cầu đến <strong>hotro@nexloot.vn</strong>. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
          </p>
        </div>

        <div>
          <p>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc. Hãy liên hệ ngay nếu bạn cần tư vấn sản phẩm, xử lý đơn hàng hoặc góp ý cải thiện dịch vụ.
          </p>
        </div>
      </div>
    </div>
  );
}
