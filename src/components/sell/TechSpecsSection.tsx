interface Spec {
  key: string;
  value: string;
}

interface Props {
  specs: Spec[];
  setSpecs: (specs: Spec[]) => void;
}

export default function TechSpecsSection({ specs, setSpecs }: Props) {
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[i][field] = val;
    setSpecs(updated);
  };

  const add = () => setSpecs([...specs, { key: '', value: '' }]);
  const remove = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));

  return (
    <div className="border rounded-lg p-5 space-y-5">
      <h2 className="font-semibold text-lg">Tech Specs</h2>
      {specs.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-1/3 border rounded px-3 py-2"
            placeholder="Key (e.g. CPU)"
            value={s.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            className="w-2/3 border rounded px-3 py-2"
            placeholder="Value (e.g. Intel i7)"
            value={s.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="text-red-500 font-bold px-2"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-indigo-600 hover:underline">
        + Add Spec
      </button>
    </div>
  );
}
