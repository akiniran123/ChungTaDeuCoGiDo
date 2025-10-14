import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: "lh3.googleusercontent.com", // Cho phép ảnh avatar Google
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Nếu dùng GitHub login
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com", // Nếu dùng Discord login
      },
    ],
  },
};

export default nextConfig;
