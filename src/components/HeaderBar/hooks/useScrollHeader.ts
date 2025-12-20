// hooks/useScrollHeader.ts
import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollHeader({
  hideThreshold = 80,
  showThreshold = 20,
  topShowThreshold = 40,
  minToggleInterval = 120, // ms: tránh toggle quá nhanh
  sensitivity = 1.2,
} = {}) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const lastTime = useRef(Date.now());
  const lastToggle = useRef(0);
  const raf = useRef<number | null>(null);

  const forceShow = useCallback(() => {
    lastToggle.current = Date.now();
    setVisible(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;
        const now = Date.now();
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const dy = y - lastY.current;
        const dt = Math.max(1, now - lastTime.current);
        const velocity = Math.abs(dy) / dt * 1000 * sensitivity; // px/s

        // always show near top
        if (y <= topShowThreshold) {
          if (!visible && now - lastToggle.current > minToggleInterval) {
            lastToggle.current = now;
            setVisible(true);
          }
        } else if (dy > 0 && y > hideThreshold) {
          // scrolling down -> hide
          if (now - lastToggle.current > minToggleInterval) {
            // if fast scroll hide immediately, else hide after small debounce
            if (velocity > 800) {
              lastToggle.current = now;
              setVisible(false);
            } else {
              lastToggle.current = now;
              setVisible(false);
            }
          }
        } else if (dy < 0) {
          // scrolling up -> show if moved enough or fast
          if ((Math.abs(dy) > showThreshold || velocity > 600) && now - lastToggle.current > minToggleInterval) {
            lastToggle.current = now;
            setVisible(true);
          }
        }

        lastY.current = y;
        lastTime.current = now;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });

    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
    };
  }, [hideThreshold, showThreshold, topShowThreshold, minToggleInterval, sensitivity, visible]);

  return { showHeader: visible, forceShow };
}