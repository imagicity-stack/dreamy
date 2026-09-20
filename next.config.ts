import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images the council uploads live in the project's Firebase Storage bucket.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
