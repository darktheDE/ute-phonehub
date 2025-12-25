import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cellphones.com.vn',
      },
    ],
  },
  turbopack: {
    root: 'C:/Users/Lenovo/ute-phonehub/frontend', // Absolute path to frontend
  },
};

export default nextConfig;
