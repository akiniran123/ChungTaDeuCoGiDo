interface Props {
  title: string;
  setTitle: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  isPrivate: boolean;
  setIsPrivate: (val: boolean) => void;
}

export default function ListingInformation({
  title,
  setTitle,
  category,
  setCategory,
  isPrivate,
  setIsPrivate,
}: Props) {
  return (
    <div className="border rounded-lg p-5 space-y-5">
      <h2 className="font-semibold text-lg">Listing information</h2>
      <div>
        <label className="block font-medium mb-1">Category *</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="gaming_pc">Gaming PC</option>
          <option value="gpu">GPU</option>
          <option value="cpu">CPU</option>
          <option value="peripheral">Peripheral</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Listing name *</label>
        <input
          type="text"
          placeholder="Example: BNIB Intel Core i9-9900k..."
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Private Listing</p>
          <p className="text-sm text-gray-500">Only accessible via special link</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
              isPrivate ? 'translate-x-5' : ''
            }`}
          />
        </label>
      </div>
    </div>
  );
}
