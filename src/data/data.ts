export const categories = [
  { label: "PC", href: "/category/PC" },
  { label: "Công nghệ", href: "/category/cong-nghe" },
  { label: "Nhà cửa", href: "/category/nha-cua" },
  { label: "Thời trang", href: "/category/thoi-trang" },
  { label: "Thực phẩm", href: "/category/thuc-pham" },
  { label: "Du lịch", href: "/category/du-lich" },
  { label: "Mã giảm giá", href: "/category/ma-giam-gia" },
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
};

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
  author: `Người dùng ${i + 1}`,
  content: `Đây là trải nghiệm camping số ${i + 1}, cảm giác thật tuyệt! 🌲🔥`,
}));