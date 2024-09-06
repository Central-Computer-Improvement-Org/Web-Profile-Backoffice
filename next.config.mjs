/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: false,
   images: {
      unoptimized: true,
   },
   output: process.env.NEXT_PUBLIC_OUTPUT,
   assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
   basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;
