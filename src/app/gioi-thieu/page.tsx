export default function GioiThieuPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 space-y-24">
      {/* Giới thiệu chung */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-700">Giới thiệu về Nexloot</h1>
        <p className="leading-relaxed text-lg max-w-4xl mx-auto text-gray-700">
          Nexloot là nền tảng thương mại điện tử hiện đại, mang đến trải nghiệm mua sắm
          tiện lợi, an toàn và minh bạch cho người dùng. Chúng tôi cung cấp các sản phẩm
          chất lượng cao với giá cả cạnh tranh, đồng thời ứng dụng công nghệ tiên tiến để
          tối ưu hóa hành trình mua sắm.
        </p>
        <div className="grid gap-8 md:grid-cols-3 pt-8">
          <div className="p-8 bg-white rounded-2xl shadow-md border">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Sứ mệnh</h3>
            <p className="text-gray-600 leading-relaxed">
              Mang đến giải pháp mua sắm tiện ích, an toàn, gắn kết người tiêu dùng và
              doanh nghiệp bằng công nghệ tiên tiến.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-md border">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Tầm nhìn</h3>
            <p className="text-gray-600 leading-relaxed">
              Trở thành nền tảng thương mại điện tử hàng đầu Đông Nam Á, thúc đẩy sự phát
              triển bền vững và đổi mới sáng tạo.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-md border">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Giá trị cốt lõi</h3>
            <p className="text-gray-600 leading-relaxed">
              Khách hàng là trung tâm – Công nghệ là nền tảng – Niềm tin là cam kết.
            </p>
          </div>
        </div>
      </section>

      {/* Lịch sử phát triển */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-blue-600 text-center">Lịch sử phát triển</h2>
        <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed text-justify">
          <p>
            Nexloot được thành lập vào năm 2026 bởi một nhóm nhà sáng lập trẻ, đầy nhiệt
            huyết và tầm nhìn chiến lược. Ngay từ những ngày đầu, công ty đã đặt mục tiêu
            xây dựng một nền tảng thương mại điện tử không chỉ phục vụ trong nước mà còn
            vươn ra thị trường quốc tế.
          </p>
          <p>
            Trong giai đoạn đầu, Nexloot tập trung phát triển hạ tầng công nghệ, xây dựng
            hệ thống quản lý sản phẩm, kho vận và thanh toán hiện đại. Chỉ trong năm đầu
            tiên, nền tảng đã thu hút hàng chục nghìn người dùng.
          </p>
          <p>
            Từ năm 2027 đến 2029, Nexloot mở rộng danh mục sản phẩm, hợp tác với hàng
            trăm nhà cung cấp trong và ngoài nước, đồng thời tích hợp AI vào hệ thống gợi
            ý sản phẩm. Đây là giai đoạn đánh dấu bước chuyển mình mạnh mẽ, khẳng định vị
            thế của Nexloot trên thị trường.
          </p>
        </div>
      </section>

      {/* Định hướng tương lai */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-blue-600 text-center">
          Định hướng & Phát triển tương lai
        </h2>
        <div className="max-w-4xl mx-auto text-gray-700 space-y-4 leading-relaxed text-justify">
          <p>
            Trong 5 năm tới, Nexloot đặt mục tiêu trở thành một trong những nền tảng
            thương mại điện tử hàng đầu khu vực Đông Nam Á, tập trung vào 4 trụ cột chiến
            lược:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Công nghệ tiên tiến:</strong> Đầu tư mạnh mẽ vào AI, machine
              learning và dữ liệu lớn để tối ưu trải nghiệm khách hàng.
            </li>
            <li>
              <strong>Mở rộng quốc tế:</strong> Xây dựng mạng lưới logistics và đối tác
              tại Thái Lan, Indonesia, Malaysia và các quốc gia lân cận.
            </li>
            <li>
              <strong>Cộng đồng trung thành:</strong> Phát triển chương trình thành viên,
              tích điểm và nội dung tương tác, tạo cộng đồng gắn kết.
            </li>
            <li>
              <strong>Phát triển bền vững:</strong> Cam kết gắn liền với trách nhiệm xã
              hội, bảo vệ môi trường và hỗ trợ doanh nghiệp nhỏ.
            </li>
          </ul>
        </div>
      </section>

      {/* Đội ngũ cổ đông sáng lập */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-blue-600 text-center">
          Đội ngũ cổ đông sáng lập
        </h2>

        <div className="space-y-12 max-w-5xl mx-auto">
          {[
            {
              name: "Nguyễn Tuấn Nghĩa",
              quote: "Tầm nhìn là ngọn hải đăng, dẫn lối cho mọi quyết định.",
              img: "/anhcodong/nghia.jpg",
              bio: `Trong 5 năm tới, tôi hướng đến việc đưa Nexloot trở thành nền tảng thương mại điện tử hàng đầu không chỉ trong nước mà còn trên thị trường quốc tế. Bằng việc ứng dụng mạnh mẽ công nghệ AI và dữ liệu lớn, chúng tôi sẽ tối ưu hóa trải nghiệm người dùng và mở rộng hệ sinh thái sản phẩm đa dạng.`,
              role: "Chủ sở hữu & Đồng sáng lập, Công ty NexLoot",
            },
            {
              name: "Dương Quang Anh",
              quote: "Dám nghĩ, Dám làm vươn ra thế giới.",
              img: "/anhcodong/quanganh.jpg",
              bio: `Lãnh đạo không chỉ là quyết định, mà là truyền cảm hứng để cùng hướng tới tầm nhìn chung. Thành công đo bằng giá trị tạo ra, đội ngũ vững mạnh và khả năng đổi mới liên tục. Khi đồng hành cùng đội ngũ, lắng nghe và hành động với tinh thần sáng tạo, chúng ta mới kiến tạo thành công bền lâu.`,
              role: "Chủ sở hữu & Đồng sáng lập, Công ty NexLoot",
            },
            {
              name: "Trần Đức Anh",
              quote: "Chiến lược đúng đắn tạo ra thành công bền vững.",
              img: "/anhcodong/ducanh.jpg",
              bio: `Tầm nhìn của tôi là xây dựng một tổ chức linh hoạt, sáng tạo và có văn hóa doanh nghiệp vững mạnh, đủ sức cạnh tranh trên thị trường quốc tế. Chúng tôi sẽ phát triển đội ngũ tài năng, tăng cường hợp tác toàn cầu, nhằm tạo ra giá trị bền vững và mở rộng quy mô Nexloot ra thế giới.`,
              role: "Chủ sở hữu & Đồng sáng lập, Công ty NexLoot",
            },
          ].map((person, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-gray-200 pb-10"
            >
              <img
                src={person.img}
                alt={person.name}
                className="w-32 h-32 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-200 shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900">{person.name}</h3>
                <p className="italic text-gray-600 mb-4">"{person.quote}"</p>
                <p className="text-gray-700 leading-relaxed mb-4">{person.bio}</p>
                <p className="text-sm text-gray-500 italic text-right">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
