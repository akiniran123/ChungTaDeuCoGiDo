"use client";

import { Gift, Percent, Tag, ShoppingCart } from "lucide-react";

export default function PromotionsPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="space-y-10 text-lg leading-relaxed max-w-4xl mx-auto">
        {/* Ưu đãi giảm giá */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Percent className="w-6 h-6 text-green-600" />
            Chương trình giảm giá sâu mỗi tháng
          </h2>
          <p>
            Chúng tôi liên tục triển khai các chương trình ưu đãi hấp dẫn dành cho khách hàng với mức giảm giá lên đến <strong>50%</strong> đối với những sản phẩm đang được quan tâm nhất. Đây là cơ hội tuyệt vời để bạn sở hữu những món đồ chất lượng với mức giá hợp lý hơn bao giờ hết. Mỗi tháng đều có danh sách sản phẩm khuyến mãi mới — đừng bỏ lỡ!
          </p>
        </div>

        {/* Ưu đãi cho khách hàng mới */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Tag className="w-6 h-6 text-blue-500" />
            Ưu đãi đặc biệt dành cho người dùng mới
          </h2>
          <p>
            Nếu bạn là khách hàng lần đầu mua sắm tại cửa hàng, hãy đăng ký tài khoản ngay hôm nay để nhận <strong>mã giảm giá 10%</strong> cho đơn hàng đầu tiên. Ngoài ra, bạn còn có cơ hội nhận thêm các phần quà nho nhỏ như thẻ quà tặng, miễn phí vận chuyển hoặc các combo hấp dẫn. Chào đón bạn đến với cộng đồng mua sắm của chúng tôi!
          </p>
        </div>

        {/* Khuyến mãi theo mùa & lễ hội */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <ShoppingCart className="w-6 h-6 text-yellow-500" />
            Ưu đãi theo mùa và sự kiện đặc biệt
          </h2>
          <p>
            Vào các dịp lễ như <em>Tết Nguyên Đán, Giáng sinh, Black Friday, 8/3, 20/10,...</em>, hệ thống sẽ tung ra các chương trình giảm giá quy mô lớn với nhiều phần quà giá trị. Từ giảm giá trực tiếp đến ưu đãi vận chuyển và các gói quà tặng — tất cả đều nhằm tri ân sự ủng hộ của khách hàng suốt thời gian qua.
          </p>
        </div>

        {/* Ưu đãi bí mật định kỳ */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-red-500" />
            Ưu đãi định kỳ chỉ dành riêng cho bạn
          </h2>
          <p>
            {'Đăng ký nhận bản tin để được gửi những khuyến mãi "bí mật" định kỳ mà không phải ai cũng biết. Đây là những ưu đãi riêng tư được gửi qua email hoặc tài khoản của bạn. Hãy luôn sẵn sàng mở thông báo để không bỏ lỡ những món quà bất ngờ từ chúng tôi!'}
          </p>
        </div>

        {/* Lời kết */}
        <div>
          <p className="italic text-base text-gray-600 dark:text-gray-400">
            Các chương trình ưu đãi sẽ được cập nhật liên tục và thay đổi theo từng thời điểm. Chúng tôi luôn nỗ lực để mang đến cho bạn trải nghiệm mua sắm tốt nhất với mức giá ưu đãi nhất.
          </p>
        </div>
      </div>
    </div>
  );
}