export default function GioiThieuPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Giới thiệu chung */}
      <h1 className="text-3xl font-bold mb-6">Giới thiệu về Nexloot</h1>
      <p className="mb-3 leading-relaxed">
        Nexloot là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm chất lượng cao
        với giá cả hợp lý. Kể từ khi thành lập, chúng tôi đã không ngừng phát triển và mở
        rộng hệ sinh thái sản phẩm, dịch vụ nhằm mang lại trải nghiệm mua sắm tiện lợi và
        an toàn nhất cho khách hàng.
      </p>
      <p className="mb-8 leading-relaxed">
        Trong suốt quá trình hoạt động, Nexloot đã khẳng định vị thế của mình trên thị trường
        với đội ngũ lãnh đạo tâm huyết, chiến lược phát triển bền vững và tầm nhìn dài hạn.
      </p>

      {/* Lịch sử & Định hướng */}
      <h2 className="text-2xl font-semibold mb-6">Lịch sử phát triển & Định hướng</h2>
      <p className="mb-10 leading-relaxed">
        Công ty được thành lập năm 2025  với mục tiêu tạo ra một hệ sinh thái thương mại điện tử
        đáng tin cậy. Định hướng của chúng tôi trong 5 năm tới là mở rộng ra thị trường quốc tế,
        kết hợp công nghệ AI và dữ liệu lớn để tối ưu hóa trải nghiệm khách hàng.
      </p>

      {/* Đội ngũ cổ đông sáng lập */}
      <h2 className="text-2xl font-semibold mb-8">Đội ngũ cổ đông sáng lập</h2>

      {/* Cổ đông 1 */}
      <div className="flex flex-col mb-16 border-b border-gray-200 pb-10 last:border-none last:pb-0">
        <div className="flex gap-8">
          <img
            src="/anhcodong/nghia.jpg"
            alt="Nguyễn Tuấn Nghĩa"
            className="w-28 h-28 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col flex-1">
            <h3 className="text-2xl font-semibold mb-3">Nguyễn Tuấn Nghĩa</h3>
            <p className="italic text-gray-700 mb-5 max-w-prose leading-relaxed">
              "Tầm nhìn là ngọn hải đăng, dẫn lối cho mọi quyết định."
            </p>
            <p className="text-gray-800 max-w-prose mb-8 leading-relaxed">
             Trong 5 năm tới, tôi hướng đến việc đưa Nexloot trở thành nền tảng thương mại điện tử hàng đầu không chỉ trong nước mà còn trên thị trường quốc tế. Bằng việc ứng dụng mạnh mẽ công nghệ AI và dữ liệu lớn, chúng tôi sẽ tối ưu hóa trải nghiệm người dùng và mở rộng hệ sinh thái sản phẩm đa dạng, đáp ứng nhu cầu toàn cầu.
            </p>
            <p className="text-sm text-gray-500 italic max-w-prose text-right mt-4 pr-6">
              Chủ sở hữu &amp; Đồng sáng lập, Công ty NexLoot
            </p>
          </div>
        </div>
      </div>

      {/* Cổ đông 2 */}
      <div className="flex flex-col mb-16 border-b border-gray-200 pb-10 last:border-none last:pb-0">
        <div className="flex gap-8">
          <img
            src="/anhcodong/quanganh.jpg"
            alt="Dương Quang Anh"
            className="w-28 h-28 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col flex-1">
            <h3 className="text-2xl font-semibold mb-3">Dương Quang Anh</h3>
            <p className="italic text-gray-700 mb-5 max-w-prose leading-relaxed">
              "Dám nghĩ, Dám làm vươn ra thế giới."
            </p>
            <p className="text-gray-800 max-w-prose mb-8 leading-relaxed">
              Lãnh đạo không chỉ là quyết định, mà là truyền cảm hứng để cùng hướng tới tầm nhìn chung. Thành công đo bằng giá trị tạo ra, đội ngũ vững mạnh và khả năng đổi mới liên tục. Khi đồng hành cùng đội ngũ, lắng nghe và hành động với tinh thần sáng tạo, chúng ta mới kiến tạo thành công bền lâu.
            </p>
            <p className="text-sm text-gray-500 italic max-w-prose text-right mt-4 pr-6">
              Chủ sở hữu &amp; Đồng sáng lập, Công ty NexLoot
            </p>
          </div>
        </div>
      </div>

      {/* Cổ đông 3 */}
      <div className="flex flex-col mb-16 border-b border-gray-200 pb-10 last:border-none last:pb-0">
        <div className="flex gap-8">
          <img
            src="/anhcodong/ducanh.jpg"
            alt="Trần Đức Anh"
            className="w-28 h-28 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col flex-1">
            <h3 className="text-2xl font-semibold mb-3">Trần Đức Anh</h3>
            <p className="italic text-gray-700 mb-5 max-w-prose leading-relaxed">
              "Chiến lược đúng đắn tạo ra thành công bền vững."
            </p>
            <p className="text-gray-800 max-w-prose mb-8 leading-relaxed">
              Tầm nhìn của tôi là xây dựng một tổ chức linh hoạt, sáng tạo và có văn hóa doanh nghiệp vững mạnh, đủ sức cạnh tranh trên thị trường quốc tế. Chúng tôi sẽ phát triển đội ngũ tài năng, tăng cường hợp tác toàn cầu, nhằm tạo ra giá trị bền vững và mở rộng quy mô Nexloot ra thế giới.
            </p>
            <p className="text-sm text-gray-500 italic max-w-prose text-right mt-4 pr-6">
              Chủ sở hữu &amp; Đồng sáng lập, Công ty NexLoot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
