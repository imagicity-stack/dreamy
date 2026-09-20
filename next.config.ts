import type { NextConfig } from "next";

/**
 * Only the fest's own bucket may be optimised. A pattern with no pathname
 * matches every object on the host, which would let anyone serve arbitrary
 * images through this site's `/_next/image` — and every upload URL
 * `src/lib/media.ts` produces is on firebasestorage.googleapis.com, so the
 * wider host is not needed at all.
 */
const bucket = process.env.FIREBASE_STORAGE_BUCKET?.trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: bucket ? `/v0/b/${bucket}/o/**` : "/v0/b/**",
      },
    ],
  },
};

export default nextConfig;
