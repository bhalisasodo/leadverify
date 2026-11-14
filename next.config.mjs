/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local /public images are served by Next.js directly; no remote patterns needed.
    unoptimized: false,
  },
};

export default nextConfig;
