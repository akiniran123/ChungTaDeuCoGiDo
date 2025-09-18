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

// ✅ Danh sách tên người dùng thay cho "Người dùng 1,2..."
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

// ✅ Danh sách user thật để hiện profile
export const users = [
  {
    name: "Nam",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
    joinDate: "2024-01-15",
    bio: "Mình là Nam, thích camping và chia sẻ deal hot 🔥",
  },
  {
    name: "Huy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
    joinDate: "2024-02-20",
    bio: "Huy đây, chuyên đăng các deal công nghệ 💻",
  },
  {
    name: "Lan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
    joinDate: "2024-03-05",
    bio: "Lan yêu thích thời trang và shopping 👗",
  },
  {
    name: "Trang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Trang",
    joinDate: "2024-03-12",
    bio: "Trang thích du lịch và trải nghiệm ✈️",
  },
  {
    name: "Minh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
    joinDate: "2024-04-01",
    bio: "Minh chuyên săn deal đồ gia dụng 🏠",
  },
  {
    name: "Hoa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa",
    joinDate: "2024-04-10",
    bio: "Hoa thích nấu ăn và ẩm thực 🍲",
  },
  {
    name: "Tuấn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuấn",
    joinDate: "2024-05-02",
    bio: "Tuấn mê công nghệ và xe 🚗",
  },
  {
    name: "Ngọc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngọc",
    joinDate: "2024-05-18",
    bio: "Ngọc yêu thích sách và viết lách 📚",
  },
  {
    name: "Linh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
    joinDate: "2024-06-01",
    bio: "Linh thích âm nhạc và nghệ thuật 🎶",
  },
  {
    name: "Quang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quang",
    joinDate: "2024-06-15",
    bio: "Quang thích thể thao và du lịch mạo hiểm 🏔️",
  },
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
  author: userNames[i % userNames.length], // ✅ dùng tên từ userNames
  content: `Đây là trải nghiệm camping số ${i + 1}, cảm giác thật tuyệt! 🌲🔥`,
  createdAt: getRandomTimeAgo(), // ✅ random thời gian
}));
