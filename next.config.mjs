/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: true,
   images: {
      unoptimized: true,
   },
   // TODO : komen output, assetPrefix & basePath jika running lokal, aktifkan kembali ketika push
   output: "export",
   assetPrefix: 'https://central-computer-improvement-org.github.io/Web-Profile-Backoffice',
   basePath: '/Web-profile-Backoffice'
};


export default nextConfig;
