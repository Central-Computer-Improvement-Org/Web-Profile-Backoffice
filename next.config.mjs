/** @type {import('next').NextConfig} */
import 'dotenv/config';
// import pkg from 'dotenv-webpack';
// const {Dotenv} = pkg;
// import path from 'path';
// console.info(pkg)
const cspHeader = `
   default-src 'self';
   script-src 'self' 'unsafe-eval' 'unsafe-inline';
   style-src 'self' 'unsafe-inline';
   img-src 'self' blob: data:;
   font-src 'self';
   object-src 'none';
   base-uri 'self';
   form-action 'self';
   frame-ancestors 'none';
   upgrade-insecure-requests;
`;

const nextConfig = {
   reactStrictMode: false,
   images: {
      unoptimized: true,
   },
   // source: '/(.*)',
   // headers: [
   //    {
   //       key: 'Content-Security-Policy',
   //       value: cspHeader.replace(/\n/g, ''),
   //    },
   // ],
   // TODO : komen config dibawah jika running lokal, aktifkan kembali ketika push & SET TO ENV
   output: "export",
   assetPrefix: process.env.NEXT_PUBLIC_DEVELOPMENT == 1 ? '' : process.env.NEXT_PUBLIC_ASSET_PREFIX,
   basePath: process.env.NEXT_PUBLIC_DEVELOPMENT == 1 ? '' : process.env.NEXT_PUBLIC_BASE_PATH,
   experimental: {
      missingSuspenseWithCSRBailout: false,
   },
};

export default nextConfig;
