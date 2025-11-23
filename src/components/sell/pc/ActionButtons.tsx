'use client'

type Props = {
  loading: boolean
  message?: string | null
}

export default function ActionButtons({ loading, message }: Props) {
  return (
    <div className="flex flex-col items-end space-y-2">
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 transition hover:bg-purple-700"
      >
        {loading ? 'Đang đăng...' : 'Đăng sản phẩm'}
      </button>

      {/* ✅ Hiển thị thông báo thành công hoặc thất bại */}
      {message && (
        <p
          className={`text-sm ${
            message.includes('thành công')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
