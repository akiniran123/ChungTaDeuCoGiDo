export default function TechSpecsSection({
  specs,
  setSpecs,
}: {
  specs: { key: string; value: string }[]
  setSpecs: (specs: { key: string; value: string }[]) => void
}) {
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs]
    updated[i][field] = val
    setSpecs(updated)
  }

  const add = () => setSpecs([...specs, { key: '', value: '' }])
  const remove = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))

  return (
    <div className="border rounded-lg p-5 space-y-5">
      <h2 className="font-semibold text-lg">Thông số kỹ thuật</h2>
      {specs.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-1/3 border rounded px-3 py-2"
            placeholder="Tên thông số (VD: CPU)"
            value={s.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            className="w-2/3 border rounded px-3 py-2"
            placeholder="Giá trị (VD: Intel i7)"
            value={s.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="text-red-500 font-bold px-2"
            title="Xóa thông số"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-indigo-600 hover:underline"
      >
        + Thêm thông số
      </button>
    </div>
  )
}
