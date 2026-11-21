import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan origin dev lokal terdaftar untuk mencegah peringatan "Blocked cross-origin request"
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
