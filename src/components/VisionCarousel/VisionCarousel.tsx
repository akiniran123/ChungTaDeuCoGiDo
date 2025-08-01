"use client";

import { useRef, useState, useEffect } from "react";

const VisionCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div className="relative w-full">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Tầm nhìn và chiến lược của cổ đông
      </h2>

      {/* Nút trái */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full shadow-md transition-opacity duration-300 ${
          canScrollLeft ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
        disabled={!canScrollLeft}
      >
        ◀
      </button>

      {/* Nút phải */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full shadow-md transition-opacity duration-300 ${
          canScrollRight ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
        disabled={!canScrollRight}
      >
        ▶
      </button>

      {/* Nội dung cuộn ngang */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth space-x-4 py-4 px-6 scrollbar-hide"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="min-w-[300px] bg-[#111] text-white p-6 rounded-xl shadow-md flex-shrink-0"
          >
            <h3 className="text-lg font-semibold mb-2">🧑‍💼 Lãnh đạo số {i + 1}</h3>
            <p>
              Chiến lược phát triển toàn diện và đổi mới sáng tạo là trọng tâm của chúng tôi trong mọi quyết định.
            </p>
            <p className="text-sm text-gray-400 mt-2">- Công ty Cổ phần ABC</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisionCarousel;
