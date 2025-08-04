"use client";

export default function NewsPage() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white space-y-12">
      {/* News Items */}
      <div className="space-y-8">

        <div>
          <h2 className="text-xl font-semibold mb-1">🆕 Nền tảng mới – Tốc độ & hiệu quả vượt trội</h2>
          <p>
            Phiên bản nền tảng thương mại điện tử mới giúp tăng tốc độ tải trang đến 40%,
            cải thiện giao diện và trải nghiệm mua sắm toàn diện cho cả người dùng và nhà bán.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">🎉 Chạm mốc 1 triệu người dùng</h2>
          <p>
            Sau 6 tháng ra mắt, hệ thống đã thu hút hơn 1 triệu người đăng ký. Chúng tôi xin cảm ơn cộng đồng
            đã tin tưởng và đồng hành trong hành trình phát triển không ngừng này.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">🤖 Tìm kiếm thông minh bằng AI</h2>
          <p>
            Hệ thống AI mới phân tích hành vi và xu hướng, giúp đề xuất sản phẩm chính xác hơn, tăng trải nghiệm và hiệu quả mua sắm cho người dùng.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">📊 Báo cáo thị trường định kỳ</h2>
          <p>
            Hàng tháng, người bán có thể theo dõi báo cáo xu hướng sản phẩm, biến động giá và nhu cầu thị trường trực tiếp trong tài khoản cá nhân.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">🚚 Tăng tốc vận chuyển toàn quốc</h2>
          <p>
            Hợp tác với các đối tác logistics lớn giúp rút ngắn thời gian giao hàng, đồng giá ship và hoàn tiền khi chậm trễ – mang lại trải nghiệm tốt hơn cho khách.
          </p>
        </div>

      </div>
    </div>
  );
}
