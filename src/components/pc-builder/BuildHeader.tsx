// src/components/pc-builder/BuildHeader.tsx
export default function BuildHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Choose Your Parts</h1>
      <div className="bg-white border shadow p-4 rounded flex items-center justify-between">
        <input
          type="text"
          readOnly
          className="w-full max-w-md border px-3 py-1 rounded text-sm"
          value="https://yourdomain.com/list/abc123"
        />
        <div className="text-green-600 font-semibold ml-4">
          ✅ Compatibility: No issues found.
        </div>
        <div className="ml-auto font-semibold text-blue-600">
          ⚡ Estimated Wattage: 0W
        </div>
      </div>
    </div>
  );
}
