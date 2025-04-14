import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://library-mis.vercel.app/',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  output: 'export',
};

export default nextConfig;
