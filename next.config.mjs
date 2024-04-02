/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: true,
   images: {
      unoptimized: true,
   },
   redirects: async () => {
      return [
         {
            source: '/',
            destination: '/login',
            permanent: false
         }
      ]
   },
   // TODO : komen config dibawah jika running lokal, aktifkan kembali ketika push
   output: "export",
   assetPrefix: 'https://central-computer-improvement-org.github.io/Web-Profile-Backoffice',
   basePath: '/Web-Profile-Backoffice',
   experimental: {
      missingSuspenseWithCSRBailout: false,
   },
};


export default nextConfig;
