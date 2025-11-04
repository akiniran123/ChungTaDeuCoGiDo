'use client'

export default function PriceAndOffers({
  price,
  enableOffers,
  minOffer,
  onChangePrice,
  onChangeEnableOffers,
  onChangeMinOffer,
}: {
  price: number | null
  enableOffers: boolean | null
  minOffer: number | null
  onChangePrice: (v: number) => void
  onChangeEnableOffers: (v: boolean) => void
  onChangeMinOffer: (v: number) => void
}) {
  return (
    <div className="border rounded-lg p-5 space-y-6 shadow-sm">
      <h2 className="font-semibold text-lg">Giá & Thương lượng</h2>

      {/* Giá bán */}
      <div className="space-y-1">
        <label className="font-medium">
          Giá bán <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={price ?? ''}
          onChange={(e) => onChangePrice(Number(e.target.value))}
          min={0}
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập giá sản phẩm"
        />
      </div>

      {/* Cho phép thương lượng */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!enableOffers}
          onChange={(e) => onChangeEnableOffers(e.target.checked)}
          className="scale-125"
        />
        <label className="font-medium">Cho phép người mua trả giá</label>
      </div>

      {/* Giá thấp nhất chấp nhận */}
      {enableOffers && (
        <div className="space-y-1">
          <label className="font-medium">Giá thấp nhất chấp nhận</label>
          <input
            type="number"
            value={minOffer ?? ''}
            onChange={(e) => onChangeMinOffer(Number(e.target.value))}
            min={0}
            className="w-full border rounded px-3 py-2"
            placeholder="Ví dụ: 500,000"
          />
        </div>
      )}
    </div>
  )
}
