// hooks/useScrollHeader.ts
import { useEffect, useRef, useState } from "react";

export function useScrollNavBar() {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollPosition = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setShowHeader(false);
          } else {
            setShowHeader(true);
          }

          lastScrollY.current = currentScrollY;
          scrollPosition.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { showHeader, scrollPosition };
}