'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

// ✅ Thêm kiểu cho link có thể có isNew
type MainLink = {
  name: string;
  path: string;
  isNew?: boolean;
};

const mainLinksLeft: MainLink[] = [
  { name: 'Giới thiệu', path: '/Giới thiệu' },
  { name: 'Tin tức', path: '/Tin tức' },
  { name: 'Khuyến mãi & Ưu đãi', path: '/Khuyến mãi & Ưu đãi' },
  { name: 'Sản phẩm công nghệ mới', path: '/Sản phẩm công nghệ mới', isNew: true },
  { name: 'Tuyển dụng', path: '/Tuyển dụng' },
];

const mainLinksRight: MainLink[] = [
  { name: 'Chính sách & Điều khoản, Điều kiện', path: '/Chính sách & Điều khoản, Điều kiện' },
  { name: 'Liên hệ & Hỗ trợ', path: '/Liên hệ & Hỗ trợ' },
];

const categoryMenu = [
  {
    name: 'PC',
    subItems: ['PC Gaming', 'PC Văn Phòng', 'PC Workstation'],
  },
  {
    name: 'Thời trang',
    subItems: ['Nam', 'Nữ', 'Phụ kiện'],
  },
  {
    name: 'Xe cộ',
    subItems: ['Ô tô', 'Xe máy', 'Phụ tùng'],
  },
  {
    name: 'Công nghệ',
    subItems: ['Điện thoại', 'Laptop', 'Thiết bị thông minh'],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  let timer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timer);
    setCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setCategoryOpen(false);
      setSubmenuOpen(null);
    }, 300);
  };

  return (
    <div className="border-t dark:border-gray-700">
      {/* Mobile toggle */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="text-sm font-semibold">MENU</span>
      </div>

      {/* Desktop menu */}
      <nav className="hidden md:flex justify-center gap-6 font-semibold text-sm py-3 relative">
        {/* Danh mục */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
            Danh mục <ChevronDown className="w-4 h-4" />
          </div>

          {categoryOpen && (
            <div
              className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md z-50 min-w-[200px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {categoryMenu.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setSubmenuOpen(item.name)}
                >
                  <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {item.name} <ChevronRight className="w-4 h-4" />
                  </div>

                  {submenuOpen === item.name && (
                    <div
                      className="absolute top-0 left-full bg-white dark:bg-gray-800 rounded-md shadow-md min-w-[180px] z-50"
                      onMouseEnter={() => clearTimeout(timer)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem}
                          href={`/${item.name}/${subItem}`}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links bên trái */}
        {mainLinksLeft.map(({ name, path, isNew }) => (
          <Link
            key={path}
            href={path}
            className={`hover:text-indigo-600 transition-colors ${
              pathname === path ? 'text-indigo-500 underline underline-offset-4' : ''
            }`}
          >
            {isNew ? (
              <span>
                {name}
                <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">NEW</span>
              </span>
            ) : (
              name
            )}
          </Link>
        ))}

        {/* Links bên phải */}
        {mainLinksRight.map(({ name, path }) => (
          <Link
            key={path}
            href={path}
            className={`hover:text-indigo-600 transition-colors ${
              pathname === path ? 'text-indigo-500 underline underline-offset-4' : ''
            }`}
          >
            {name}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 font-semibold text-sm space-y-2">
          {[...mainLinksLeft, ...mainLinksRight].map((item, index) => (
            <Link
              key={item.path || index}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-1 ${
                pathname === item.path ? 'text-indigo-500 underline underline-offset-4' : ''
              }`}
            >
              {'isNew' in item && item.isNew ? (
                <span>
                  {item.name}
                  <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">NEW</span>
                </span>
              ) : (
                item.name
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
