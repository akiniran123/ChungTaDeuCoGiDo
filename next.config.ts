/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ Cho phép ảnh avatar Google
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // (Tuỳ chọn) nếu dùng GitHub login
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com", // (Tuỳ chọn) nếu dùng Discord login
      },
    ],
  },
};

module.exports = nextConfig;
