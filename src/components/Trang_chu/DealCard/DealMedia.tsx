"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase/client"; // nhớ import đúng đường dẫn nhé

const DealMedia = ({
  mediaList = [],
  currentIndex = 0,
  nextMedia,
  prevMedia,
  handleTouchStart,
  handleTouchEnd,
  bigger,
  onUploadSuccess, // thêm prop để thông báo cho cha nếu cần
}: any) => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [list, setList] = useState(mediaList);

  // ✅ Kiểm tra URL hợp lệ
  const isValidUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith("http") ||
      url.startsWith("blob:") ||
      url.startsWith("data:image") ||
      url.startsWith("/") // local
    );
  };

  // ✅ Xử lý dán link để upload lên Supabase
  const handlePasteLink = async () => {
    if (!imageUrl) return alert("Hãy nhập link ảnh!");
    try {
      setUploading(true);

      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error("Không thể tải ảnh từ link này.");
      const blob = await res.blob();

      const fileName = `img-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("images") // tên bucket
        .upload(fileName, blob, { contentType: blob.type });

      if (error) throw error;

      // Lấy public URL
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // Cập nhật danh sách media
      const newList = [...list, publicUrl];
      setList(newList);

      if (onUploadSuccess) onUploadSuccess(publicUrl);

      alert("✅ Upload thành công!");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi upload ảnh từ link.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Lọc mediaList hợp lệ
  const safeMediaList =
    Array.isArray(list) && list.length > 0
      ? list.filter((url) => isValidUrl(url))
      : ["/placeholder.png"];

  return (
    <div className="relative w-full overflow-hidden group">
      {/* --- Nhập link upload --- */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Dán link ảnh để upload..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 rounded flex-1 text-sm"
        />
        <button
          onClick={handlePasteLink}
          disabled={uploading}
          className="bg-blue-500 text-white rounded px-3 flex items-center gap-2 hover:bg-blue-600"
        >
          <Upload size={16} />
          {uploading ? "Đang tải..." : "Upload"}
        </button>
      </div>

      {/* --- Vùng hiển thị media --- */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden"
      >
        {safeMediaList.length > 0 && (
          <>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {safeMediaList.map((item: string, idx: number) => {
                const isVideo = item.endsWith(".mp4");

                return isVideo ? (
                  <video
                    key={idx}
                    src={item}
                    controls
                    className={`object-cover w-full flex-shrink-0 rounded-md ${
                      bigger ? "h-[600px]" : "h-96"
                    }`}
                  />
                ) : (
                  <img
                    key={idx}
                    src={item}
                    alt="media"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/placeholder.png")
                    }
                    className={`object-cover w-full flex-shrink-0 rounded-md ${
                      bigger ? "h-[600px]" : "h-96"
                    }`}
                  />
                );
              })}
            </div>

            {/* Nút điều hướng */}
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/90 bg-black/10 backdrop-blur-sm border border-white/5 rounded-full p-3 shadow-sm hover:bg-black/25"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/90 bg-black/10 backdrop-blur-sm border border-white/5 rounded-full p-3 shadow-sm hover:bg-black/25"
            >
              <ChevronRight size={30} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DealMedia;
