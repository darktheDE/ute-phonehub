import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cellphones.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.cellphones.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'cellphones.com.vn',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
      },
    ],
  },
};

export default nextConfig;
