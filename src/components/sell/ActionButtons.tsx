export default function ActionButtons({
  loading,
}: {
  loading: boolean
}) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 transition hover:bg-purple-700"
      >
        {loading ? 'Đang đăng...' : 'Đăng sản phẩm'}
      </button>
    </div>
  )
}