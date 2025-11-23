'use client';

export default function TieuDeXayDungPC() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pt-[64px]">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Cấu hình PC mới
      </h1>
      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Lưu danh sách
        </button>
        <button
          type="button"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          Chia sẻ danh sách
        </button>
      </div>
    </header>
  );
}
