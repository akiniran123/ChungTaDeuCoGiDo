'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function NavLinks() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAds, setShowAds] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    function handleScroll() {
      // Ẩn quảng cáo khi cuộn xuống quá 100px
      setShowAds(window.scrollY < 100);
    }

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const fallbackImg =
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80';

  const ads = [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1600&q=80',
      link: '/advertising/1',
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
      link: '/advertising/2',
    },
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
      link: '/advertising/3',
    },
  ];

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = fallbackImg;
  };

  if (!showAds) return null; // Ẩn toàn bộ component nếu không hiển thị quảng cáo

  return (
    <div className="w-full m-0 p-0 rounded-none shadow-none">
      {/* Desktop full-width */}
      <div className="hidden md:block w-full h-[70px]">
        <Slider {...settings}>
          {ads.map((ad) => (
            <a key={ad.id} href={ad.link} className="block">
              <img
                src={ad.img}
                alt={`Ad ${ad.id}`}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-[70px] object-cover m-0 p-0"
              />
            </a>
          ))}
        </Slider>
      </div>

      {/* Mobile full-width */}
      {isMobile && (
        <div className="w-full h-[50px]">
          <Slider {...settings}>
            {ads.map((ad) => (
              <a key={ad.id} href={ad.link} className="block">
                <img
                  src={ad.img}
                  alt={`Ad ${ad.id}`}
                  loading="lazy"
                  onError={handleImgError}
                  className="w-full h-[50px] object-cover m-0 p-0"
                />
              </a>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}