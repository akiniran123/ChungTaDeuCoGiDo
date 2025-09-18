export const categories = [
  { label: "PC", href: "/category/PC" },
  { label: "Công nghệ", href: "/category/cong-nghe" },
  { label: "Nhà cửa", href: "/category/nha-cua" },
  { label: "Thời trang", href: "/category/thoi-trang" },
  { label: "Thực phẩm", href: "/category/thuc-pham" },
  { label: "Du lịch", href: "/category/du-lich" },
  { label: "Mã giảm giá", href: "/category/ma-giam-gia" },
  {
    label: "Về chúng tôi",
    href: "",
    children: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Tuyển dụng", href: "/jobs" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
  {
    label: "Hỗ trợ",
    href: "",
    children: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Điều khoản sử dụng", href: "/terms" },
    ],
  },
  {
    label: "Cộng đồng",
    href: "",
    children: [
      { label: "Diễn đàn", href: "/forum" },
      { label: "Blog", href: "/blog" },
      { label: "Sự kiện", href: "/events" },
    ],
  },
  {
    label: "Kết nối",
    href: "",
    children: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
];

export const communityMembers = [
  { id: 1, name: "Thành viên A", followers: 1200, stars: 4.8 },
  { id: 2, name: "Thành viên B", followers: 950, stars: 4.6 },
  { id: 3, name: "Thành viên C", followers: 800, stars: 4.5 },
  { id: 4, name: "Thành viên D", followers: 600, stars: 4.2 },
  { id: 5, name: "Thành viên E", followers: 500, stars: 4.0 },
];

const productNames = [
  "First site as I open my eyeballs this morning",
  "Camping view with sunrise",
  "Unexpected guest in the tent",
  "Night under the stars",
  "Cozy campfire vibes",
  "Rainy morning camping",
  "Hiking to the peak",
  "River crossing adventure",
  "Cooking instant noodles at night",
  "Backpacking in the forest",
  "Sunset over the lake",
  "Lost in the jungle",
  "Campfire storytelling",
  "Rain shelter with tarp",
  "Sleeping under moonlight",
  "Starry night photography",
  "Fishing at dawn",
  "Morning coffee in woods",
  "Wild animal encounter",
  "Group camping fun",
  "Chilling in hammock",
  "Exploring caves",
  "Mountain top view",
  "Snow camping experience",
  "Cooking BBQ outdoors",
  "Hot tea in the cold",
  "Solo camping meditation",
  "Bikepacking journey",
  "Kayaking with friends",
  "Relaxing by the fire",
];

// ✅ Thay tên "Người dùng 1,2..." thành danh sách tên đẹp
const userNames = [
  "Nam",
  "Huy",
  "Lan",
  "Trang",
  "Minh",
  "Hoa",
  "Tuấn",
  "Ngọc",
  "Linh",
  "Quang",
];

export type Deal = {
  id: number;
  title: string;
  image: string;
  votes: number;
  comments: number;
  category: string;
  likes: number;
  hearts: number;
  reacts: number;
  author: string;
  content: string;
  createdAt?: string; // ✅ thêm createdAt
};

// ✅ Hàm random thời gian
function getRandomTimeAgo() {
  const minutes = Math.floor(Math.random() * 60);
  const hours = Math.floor(Math.random() * 24);
  const days = Math.floor(Math.random() * 7);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  return `${minutes} phút trước`;
}

export const sampleDeals: Deal[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: productNames[i % productNames.length],
  image: `https://picsum.photos/seed/reddit${i}/800/600`,
  votes: Math.floor(Math.random() * 8000),
  comments: Math.floor(Math.random() * 500),
  category: "Camping",
  likes: 0,
  hearts: 0,
  reacts: 0,
  author: userNames[i % userNames.length], // ✅ lấy tên thay vì "Người dùng X"
  content: `Đây là trải nghiệm camping số ${i + 1}, cảm giác thật tuyệt! 🌲🔥`,
  createdAt: getRandomTimeAgo(), // ✅ random thời gian
}));
