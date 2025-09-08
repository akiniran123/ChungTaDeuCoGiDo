"use client";
import ToggleFooterSection from "./ToggleFooterSection";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-0">
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
        <div className="flex flex-col items-center text-xs leading-tight space-y-0">
          <ToggleFooterSection
            title="Về chúng tôi"
            items={[
              { label: "Giới thiệu", href: "/gioi-thieu" },
              { label: "Tuyển dụng", href: "/jobs" },
              { label: "Liên hệ", href: "/contact" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center text-xs leading-tight space-y-0">
          <ToggleFooterSection
            title="Hỗ trợ"
            items={[
              { label: "Trung tâm trợ giúp", href: "/help" },
              { label: "Chính sách bảo mật", href: "/privacy" },
              { label: "Điều khoản sử dụng", href: "/terms" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center text-xs leading-tight space-y-0">
          <ToggleFooterSection
            title="Cộng đồng"
            items={[
              { label: "Diễn đàn", href: "/forum" },
              { label: "Blog", href: "/blog" },
              { label: "Sự kiện", href: "/events" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center text-xs leading-tight space-y-0">
          <ToggleFooterSection
            title="Kết nối"
            items={[
              { label: "Facebook", href: "https://facebook.com" },
              { label: "Twitter", href: "https://twitter.com" },
              { label: "Instagram", href: "https://instagram.com" },
            ]}
          />
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-500 mt-0">
        © 2025 RedditClone. All rights reserved.
      </div>
    </footer>
  );
}