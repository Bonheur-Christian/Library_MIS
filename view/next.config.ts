import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://library-mis-api.onrender.com',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
