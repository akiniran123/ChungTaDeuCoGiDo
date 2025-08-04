"use client";

export default function TermsConditionsPage() {
  return (
    <main className="w-full px-6 pt-28 pb-10 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">
        📜 Chính sách & Điều khoản, Điều kiện
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Chấp nhận điều khoản</h2>
        <p>
          Khi truy cập và sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
          Nếu bạn không đồng ý, vui lòng ngừng sử dụng trang web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Quyền và trách nhiệm người dùng</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Người dùng phải cung cấp thông tin chính xác, trung thực khi đăng ký hoặc gửi liên hệ.</li>
          <li>Không sử dụng trang web vào mục đích trái pháp luật, lừa đảo hoặc gây ảnh hưởng đến người khác.</li>
          <li>Không được sao chép, phát tán nội dung trên website khi chưa có sự cho phép bằng văn bản.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Quyền của chúng tôi</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Chúng tôi có quyền thay đổi nội dung, giao diện hoặc ngừng cung cấp dịch vụ mà không cần báo trước.</li>
          <li>Mọi nội dung (hình ảnh, văn bản, logo...) thuộc quyền sở hữu của chúng tôi và được bảo vệ bởi luật bản quyền.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">4. Liên hệ & Giải quyết khiếu nại</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến chính sách & điều khoản này,
          vui lòng liên hệ qua email: <strong>hotro@nexloot.vn</strong> hoặc hotline <strong>1900 999 888</strong>.
        </p>
      </section>
    </main>
  );
}
