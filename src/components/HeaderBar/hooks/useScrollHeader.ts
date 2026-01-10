import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollHeader({
  hideThreshold = 80,
  showThreshold = 20,
  topShowThreshold = 40,
  minToggleInterval = 120,
  sensitivity = 1.2,
} = {}) {
  const [showHeader, setShowHeader] = useState(true);
  
  // Sử dụng Ref để tránh closure cũ và loop dependency
  const visibleRef = useRef(true);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const lastToggle = useRef(0);
  const raf = useRef<number | null>(null);

  const setVisible = (val: boolean) => {
    if (visibleRef.current !== val) {
      visibleRef.current = val;
      setShowHeader(val);
    }
  };

  const forceShow = useCallback(() => {
    lastToggle.current = Date.now();
    setVisible(true);
  }, []);

  useEffect(() => {
    // Khởi tạo lastY chính xác khi mount
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (raf.current) return;

      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        
        const now = Date.now();
        const y = Math.max(0, window.scrollY || document.documentElement.scrollTop);
        const dy = y - lastY.current;
        const dt = Math.max(1, now - lastTime.current);
        const velocity = (Math.abs(dy) / dt) * 1000 * sensitivity;

        // 1. Luôn hiện khi ở gần đỉnh trang
        if (y <= topShowThreshold) {
          setVisible(true);
        } 
        // 2. Kiểm tra khoảng thời gian giữa các lần toggle để tránh giật
        else if (now - lastToggle.current > minToggleInterval) {
          
          // Cuộn xuống -> Ẩn (chỉ ẩn khi đã vượt qua ngưỡng hideThreshold)
          if (dy > 0 && y > hideThreshold) {
            lastToggle.current = now;
            setVisible(false);
          } 
          // Cuộn lên -> Hiện (khi cuộn lên đủ nhanh hoặc đủ xa)
          else if (dy < 0 && (Math.abs(dy) > showThreshold || velocity > 600)) {
            lastToggle.current = now;
            setVisible(true);
          }
        }

        lastY.current = y;
        lastTime.current = now;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hideThreshold, showThreshold, topShowThreshold, minToggleInterval, sensitivity]);

  return { showHeader, forceShow };
}