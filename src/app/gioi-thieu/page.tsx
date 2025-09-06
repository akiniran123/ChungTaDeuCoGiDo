export default function GioiThieuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-16">
      {/* Giới thiệu chung */}
      <section className="space-y-4 text-gray-800">
        <h1 className="text-4xl font-bold text-blue-700">Giới thiệu về Nexloot</h1>
        <p className="leading-relaxed">
          Nexloot là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Kể từ khi thành lập, chúng tôi đã không ngừng phát triển và mở rộng hệ sinh thái sản phẩm, dịch vụ nhằm mang lại trải nghiệm mua sắm tiện lợi và an toàn nhất cho khách hàng.
        </p>
        <p className="leading-relaxed">
          Với triết lý “Khách hàng là trung tâm”, Nexloot không chỉ tập trung vào chất lượng sản phẩm mà còn chú trọng đến dịch vụ hậu mãi, chính sách đổi trả linh hoạt và hệ thống chăm sóc khách hàng đa kênh. Chúng tôi tin rằng sự hài lòng của khách hàng là nền tảng cho sự phát triển bền vững.
        </p>
        <p className="leading-relaxed">
          Trong suốt quá trình hoạt động, Nexloot đã khẳng định vị thế của mình trên thị trường với đội ngũ lãnh đạo tâm huyết, chiến lược phát triển bài bản và tầm nhìn dài hạn. Chúng tôi không ngừng đổi mới, ứng dụng công nghệ hiện đại để nâng cao hiệu quả vận hành và tối ưu hóa trải nghiệm người dùng.
        </p>
      </section>

      {/* Lịch sử phát triển */}
      <section className="space-y-4 text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-600">Lịch sử phát triển & Định hướng</h2>
        <p className="leading-relaxed">
          Nexloot được thành lập vào năm 2026 bởi một nhóm nhà sáng lập trẻ, đầy nhiệt huyết và có tầm nhìn chiến lược. Ngay từ những ngày đầu, công ty đã xác định rõ mục tiêu: xây dựng một nền tảng thương mại điện tử không chỉ phục vụ nhu cầu trong nước mà còn có khả năng vươn ra thị trường quốc tế.
        </p>
        <p className="leading-relaxed">
          Trong giai đoạn đầu, Nexloot tập trung vào việc phát triển hạ tầng công nghệ, xây dựng hệ thống quản lý sản phẩm, kho vận và thanh toán hiện đại. Nhờ vào sự đầu tư bài bản và đội ngũ kỹ thuật xuất sắc, nền tảng đã nhanh chóng thu hút hàng chục nghìn người dùng chỉ trong năm đầu tiên.
        </p>
        <p className="leading-relaxed">
          Từ năm 2027 đến 2029, Nexloot mở rộng danh mục sản phẩm, hợp tác với hàng trăm nhà cung cấp trong và ngoài nước, đồng thời triển khai các chương trình ưu đãi, chăm sóc khách hàng và tích hợp AI vào hệ thống gợi ý sản phẩm. Đây là giai đoạn đánh dấu bước chuyển mình mạnh mẽ, đưa Nexloot trở thành một trong những nền tảng thương mại điện tử phát triển nhanh nhất tại Việt Nam.
        </p>
      </section>

      {/* Định hướng tương lai */}
      <section className="space-y-4 text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-600">Định hướng & Phát triển trong tương lai</h2>
        <p className="leading-relaxed">
          Trong 5 năm tới, Nexloot đặt mục tiêu trở thành một trong những nền tảng thương mại điện tử hàng đầu Đông Nam Á. Để đạt được điều đó, chúng tôi tập trung vào 4 trụ cột chiến lược:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
          <li>
            <strong>Công nghệ tiên tiến:</strong> Đầu tư vào AI, machine learning và phân tích dữ liệu lớn để tối ưu hóa trải nghiệm người dùng, từ gợi ý sản phẩm đến dịch vụ hậu mãi.
          </li>
          <li>
            <strong>Mở rộng thị trường quốc tế:</strong> Bắt đầu từ các nước lân cận như Thái Lan, Indonesia và Malaysia, Nexloot sẽ từng bước xây dựng mạng lưới logistics và đối tác bản địa để phục vụ khách hàng khu vực.
          </li>
          <li>
            <strong>Xây dựng cộng đồng người dùng trung thành:</strong> Thông qua các chương trình thành viên, tích điểm, và nội dung tương tác, Nexloot hướng đến việc tạo ra một cộng đồng mua sắm năng động, gắn kết và có giá trị lâu dài.
          </li>
          <li>
            <strong>Phát triển bền vững:</strong> Cam kết hoạt động kinh doanh gắn liền với trách nhiệm xã hội, bảo vệ môi trường và thúc đẩy sự phát triển của doanh nghiệp nhỏ trong hệ sinh thái.
          </li>
        </ul>
      </section>

      {/* Đội ngũ cổ đông sáng lập */}
      <section className="space-y-12">
        <h2 className="text-3xl font-semibold text-blue-600">Đội ngũ cổ đông sáng lập</h2>

        {[ /* giữ nguyên danh sách cổ đông như bạn đã viết */ 
          {
            name: 'Nguyễn Tuấn Nghĩa',
            quote: 'Tầm nhìn là ngọn hải đăng, dẫn lối cho mọi quyết định.',
            img: '/anhcodong/nghia.jpg',
            bio: `Trong 5 năm tới, tôi hướng đến việc đưa Nexloot trở thành nền tảng thương mại điện tử hàng đầu không chỉ trong nước mà còn trên thị trường quốc tế. Bằng việc ứng dụng mạnh mẽ công nghệ AI và dữ liệu lớn, chúng tôi sẽ tối ưu hóa trải nghiệm người dùng và mở rộng hệ sinh thái sản phẩm đa dạng, đáp ứng nhu cầu toàn cầu.`,
            role: 'Chủ sở hữu & Đồng sáng lập, Công ty NexLoot',
          },
          {
            name: 'Dương Quang Anh',
            quote: 'Dám nghĩ, Dám làm vươn ra thế giới.',
            img: '/anhcodong/quanganh.jpg',
            bio: `Lãnh đạo không chỉ là quyết định, mà là truyền cảm hứng để cùng hướng tới tầm nhìn chung. Thành công đo bằng giá trị tạo ra, đội ngũ vững mạnh và khả năng đổi mới liên tục. Khi đồng hành cùng đội ngũ, lắng nghe và hành động với tinh thần sáng tạo, chúng ta mới kiến tạo thành công bền lâu.`,
            role: 'Chủ sở hữu & Đồng sáng lập, Công ty NexLoot',
          },
          {
            name: 'Trần Đức Anh',
            quote: 'Chiến lược đúng đắn tạo ra thành công bền vững.',
            img: '/anhcodong/ducanh.jpg',
            bio: `Tầm nhìn của tôi là xây dựng một tổ chức linh hoạt, sáng tạo và có văn hóa doanh nghiệp vững mạnh, đủ sức cạnh tranh trên thị trường quốc tế. Chúng tôi sẽ phát triển đội ngũ tài năng, tăng cường hợp tác toàn cầu, nhằm tạo ra giá trị bền vững và mở rộng quy mô Nexloot ra thế giới.`,
            role: 'Chủ sở hữu & Đồng sáng lập, Công ty NexLoot',
          },
        ].map((person, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-10"
          >
            <img
              src={person.img}
              alt={person.name}
              className="w-28 h-28 rounded-full object-cover flex-shrink-0 mx-auto md:mx-0"
            />
            <div className="flex flex-col flex-1">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{person.name}</h3>
              <p className="italic text-gray-600 mb-4">"{person.quote}"</p>
              <p className="text-gray-700 leading-relaxed mb-6">{person.bio}</p>
              <p className="text-sm text-gray-500 italic text-right">{person.role}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}