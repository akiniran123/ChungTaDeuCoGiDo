export default function PrivateToggle({ register }: any) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="font-medium">Private Listing</p>
        <p className="text-sm text-gray-500">
          Private listings will not appear in search results or on your seller page — they can only be accessed by a special link.
        </p>
      </div>
      <div className="relative">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" {...register('isPrivate')} />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition duration-300"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}
