'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function NavLinks() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cấu hình slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // Hình ảnh quảng cáo thật (Unsplash free)
  const ads = [
    { id: 1, img: 'https://images.unsplash.com/photo-1606813902916-3f3b0b38dd5d?auto=format&fit=crop&w=1600&q=80', link: '/advertising/1' },
    { id: 2, img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1600&q=80', link: '/advertising/2' },
    { id: 3, img: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80', link: '/advertising/3' },
  ];

  return (
    <div className="border-none outline-none relative z-10">
      {/* Desktop full-width */}
      <div className="hidden md:block w-full h-[70px] mt-1">
        <Slider {...settings}>
          {ads.map((ad) => (
            <a key={ad.id} href={ad.link}>
              <img
                src={ad.img}
                alt={`Ad ${ad.id}`}
                className="w-full h-[70px] object-cover"
              />
            </a>
          ))}
        </Slider>
      </div>

      {/* Mobile full-width */}
      {isMobile && (
        <div className="w-full h-[50px] mt-1">
          <Slider {...settings}>
            {ads.map((ad) => (
              <a key={ad.id} href={ad.link}>
                <img
                  src={ad.img}
                  alt={`Ad ${ad.id}`}
                  className="w-full h-[50px] object-cover"
                />
              </a>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
