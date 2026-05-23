import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\.(mp4)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "video-cache",
        expiration: {
          maxEntries: 3,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
  ],
})(nextConfig); 