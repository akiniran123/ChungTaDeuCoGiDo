export default function BankAccountBanner() {
  return (
    <div className="flex items-start gap-4 bg-indigo-100 border border-indigo-300 p-4 rounded-md mb-6">
      <div className="text-2xl mt-1">💰</div>
      <div className="flex-1">
        <p className="font-semibold">
          Liên kết tài khoản ngân hàng để nhận thanh toán (chỉ mất vài phút!)
        </p>
        <p className="text-sm mt-1">
          Bạn có thể tạo bản nháp bài đăng, nhưng cần liên kết tài khoản ngân hàng để đăng bán hoặc nhận tiền.
          Nền tảng của chúng tôi sử dụng Stripe để liên kết tài khoản ngân hàng một cách an toàn.
        </p>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700">
        BẮT ĐẦU NGAY
      </button>
    </div>
  )
}
