'use client';

import { useState, useEffect } from 'react';

export default function NavLinks() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Không còn quảng cáo, không còn menu link
  return <div className="w-full m-0 p-0 rounded-none shadow-none"></div>;
}
