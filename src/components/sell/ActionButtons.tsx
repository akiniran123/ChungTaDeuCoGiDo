'use client';

export default function ActionButtons({
  loading,
}: {
  loading: boolean;
}) {
  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        className="px-4 py-2 rounded border text-indigo-600 border-indigo-600 hover:bg-indigo-50"
      >
        Save Draft
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Publish Now'}
      </button>
    </div>
  );
}
