import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Open-Meteo APIs to be called from server-side route handlers.
  async rewrites() {
    return [];
  },
};

export default nextConfig;
